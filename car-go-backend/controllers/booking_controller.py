from flask import request, jsonify, current_app
from datetime import date, datetime, timedelta
from models import db
from models.reservation import Reservation
from models.vehicle import Vehicle
from models.employee import Employee
from models.rent import Rent
from models.rentvehicle import RentVehicle
from apscheduler.triggers.date import DateTrigger
from controllers.payment_controller import cancel_payment_by_rent_id


# ✅ CREATE RESERVATION (with multiple vehicle_ids support)
def create_reservation():
    data = request.get_json() or {}
    required = ['cust_id', 'vehicle_ids', 'start_date', 'end_date', 'pickup_location']

    # Validate input
    for r in required:
        if not data.get(r):
            return jsonify({'success': False, 'message': f'Missing {r}'}), 400

    # Convert vehicle_ids to a list
    try:
        vehicle_ids = [int(v) for v in data['vehicle_ids']]
    except Exception:
        return jsonify({'success': False, 'message': 'Invalid vehicle_ids format'}), 400

    # Parse dates
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid date format'}), 400

    # 🔍 Find the first vehicle that’s free in the given date range
    available_vehicle = None
    for vid in vehicle_ids:
        overlap = Reservation.query.filter(
            Reservation.vehicle_id == vid,
            Reservation.status == 'Booked',
            Reservation.start_date <= end_date,
            Reservation.end_date >= start_date
        ).first()
        if not overlap:
            available_vehicle = Vehicle.query.get(vid)
            break

    if not available_vehicle:
        return jsonify({'success': False, 'message': 'All vehicles of this model are already booked for the selected dates'}), 400

    import random
    staff_members = Employee.query.filter_by(emp_role='Staff').all()
    emp = random.choice(staff_members) if staff_members else None


    # Create reservation
    reservation = Reservation(
        cust_id=data['cust_id'],
        emp_id=emp.emp_id if emp else None,
        vehicle_id=available_vehicle.vehicle_id,
        reservation_date=datetime.utcnow().date(),
        start_date=start_date,
        end_date=end_date,
        pickup_location=data.get('pickup_location'),
        status='Booked'
    )
    db.session.add(reservation)
    db.session.commit()

    # Rent calculation
    days = (end_date - start_date).days or 1
    total = float(days) * float(available_vehicle.rent_per_day)

    rent = Rent(
        reservation_id=reservation.reservation_id,
        rent_date=datetime.utcnow().date(),
        total_amount=total
    )
    db.session.add(rent)
    db.session.commit()

    # ✅ Schedule timeout for payment (inside current app context)
    with current_app.app_context():
        schedule_payment_timeout(rent.rent_id)

    # Rent-Vehicle link
    rv = RentVehicle(rent_id=rent.rent_id, vehicle_id=available_vehicle.vehicle_id)
    db.session.add(rv)
    db.session.commit()

    # ✅ Set vehicle status based on current date
    today = date.today()
    available_vehicle.status = 'Rented' if start_date <= today <= end_date else 'Available'
    db.session.commit()

    return jsonify({
        'success': True,
        'reservation_id': reservation.reservation_id,
        'rent_id': rent.rent_id,
        'vehicle_id': available_vehicle.vehicle_id
    }), 201


# ✅ Schedule a timeout job for payment
def schedule_payment_timeout(rent_id):
    """Schedules an auto-cancel job in 2 minutes if no payment is made."""
    try:
        scheduler = current_app.scheduler
    except Exception as e:
        print(f"⚠️ Scheduler not found in app context: {e}")
        return

    run_time = datetime.now() + timedelta(minutes=2)
    job_id = f"payment_timeout_{rent_id}"

    try:
        scheduler.add_job(
            func=cancel_payment_by_rent_id,
            trigger=DateTrigger(run_date=run_time),
            args=[rent_id],
            id=job_id,
            replace_existing=True
        )
        print(f"🕒 Scheduled auto-cancel for rent_id={rent_id} at {run_time} UTC")
    except Exception as e:
        print(f"⚠️ Failed to schedule payment timeout for rent_id={rent_id}: {e}")


# ✅ Manual cancellation
def cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'success': False, 'message': 'Reservation not found'}), 404

    reservation.status = 'Cancelled'
    reservation.cancel_details = 'Cancelled by user'

    # Update vehicle status
    active_booking = Reservation.query.filter(
        Reservation.vehicle_id == reservation.vehicle_id,
        Reservation.status == 'Booked',
        Reservation.start_date <= date.today(),
        Reservation.end_date >= date.today()
    ).first()

    reservation.vehicle.status = 'Rented' if active_booking else 'Available'
    db.session.commit()

    return jsonify({'success': True, 'message': 'Reservation cancelled successfully'})


# ✅ Get booking details by rent ID
def get_booking_by_rent(rent_id):
    rent = Rent.query.get(rent_id)
    if not rent:
        return jsonify({'success': False, 'message': 'Rent not found'}), 404

    reservation = rent.reservation
    if not reservation:
        return jsonify({'success': False, 'message': 'Reservation not found'}), 404

    return jsonify({
        'success': True,
        'rent_id': rent.rent_id,
        'reservation_id': reservation.reservation_id,
        'vehicle_id': reservation.vehicle_id,
        'start_date': reservation.start_date.strftime('%Y-%m-%d'),
        'end_date': reservation.end_date.strftime('%Y-%m-%d'),
        'cust_id': reservation.cust_id,
        'total_amount': rent.total_amount
    }), 200
