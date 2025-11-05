from flask import request, jsonify, current_app
from datetime import datetime, timedelta, date
from models import db
from models.payment import Payment
from models.rent import Rent
from models.reservation import Reservation
from models.vehicle import Vehicle
from models.vehicleavailability import VehicleAvailability
from apscheduler.triggers.date import DateTrigger


# ✅ MAIN PAYMENT CREATION (called when user completes payment)
def create_payment():
    data = request.get_json() or {}
    required = ['rent_id', 'cust_id', 'payment_method', 'amount']

    # Input validation
    for r in required:
        if not data.get(r):
            return jsonify({'success': False, 'message': f'Missing {r}'}), 400

    try:
        rent = Rent.query.get(data['rent_id'])
        if not rent:
            return jsonify({'success': False, 'message': 'Rent record not found'}), 404

        reservation = rent.reservation
        if not reservation:
            return jsonify({'success': False, 'message': 'Reservation not found for this rent'}), 404

        vehicle_id = reservation.vehicle_id
        cust_id = data['cust_id']

        # 🚫 Prevent duplicate payments
        if Payment.query.filter_by(rent_id=data['rent_id']).first():
            return jsonify({'success': False, 'message': 'Payment already made for this rent'}), 400

        # ✅ Create and save payment record
        payment = Payment(
            rent_id=data['rent_id'],
            cust_id=cust_id,
            payment_date=datetime.utcnow(),
            payment_method=data['payment_method'],
            amount=data['amount']
        )
        db.session.add(payment)

        # ✅ Update reservation and vehicle statuses
        reservation.status = 'Booked'
        vehicle = Vehicle.query.get(vehicle_id)
        today = date.today()
        if vehicle:
            vehicle.status = 'Rented' if reservation.start_date <= today <= reservation.end_date else 'Available'

        # ✅ Update vehicle availability
        availabilities = VehicleAvailability.query.filter_by(vehicle_id=vehicle_id).all()
        for va in availabilities:
            if (
                va.status == 'Available'
                and va.available_from <= reservation.start_date
                and va.available_to >= reservation.end_date
            ):
                va.status = 'Booked'

        db.session.commit()

        # ✅ Remove pending scheduler timeout jobs
        with current_app.app_context():
            scheduler = getattr(current_app, "scheduler", None)
            if scheduler:
                for job_id in [f"payment_timeout_{rent.rent_id}", f"cancel_rent_{rent.rent_id}"]:
                    try:
                        scheduler.remove_job(job_id)
                        print(f"🟢 Removed scheduled job: {job_id}")
                    except Exception:
                        pass

        print(f"✅ Payment processed successfully for rent_id={rent.rent_id}")
        return jsonify({
            'success': True,
            'message': 'Payment processed successfully',
            'payment_id': payment.payment_id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error in create_payment:", e)
        return jsonify({'success': False, 'message': str(e)}), 500


# ✅ SCHEDULE TIMEOUT FOR UNPAID RENT (2 minutes)
def schedule_payment_timeout(rent_id):
    """Schedules a job to auto-cancel rent if payment not made within 2 minutes."""
    try:
        scheduler = getattr(current_app, "scheduler", None)
        if not scheduler:
            print("⚠️ Scheduler not initialized in app context.")
            return

        run_time = datetime.now() + timedelta(minutes=2)
        job_id = f"payment_timeout_{rent_id}"

        scheduler.add_job(
            func=cancel_payment_by_rent_id,
            trigger=DateTrigger(run_date=run_time),
            args=[rent_id],
            id=job_id,
            replace_existing=True
        )
        print(f"⏰ Scheduled auto-cancel for rent_id={rent_id} at {run_time} UTC")

    except Exception as e:
        print(f"⚠️ Failed to schedule auto-cancel for rent_id={rent_id}: {e}")


# ✅ AUTO-CANCEL FUNCTION (runs after timeout)
def cancel_payment_by_rent_id(rent_id):
    """
    Called automatically by scheduler after 2 minutes if no payment.
    Cancels only unpaid rents.
    Handles missing Flask app context safely.
    """
    try:
        # ✅ Ensure Flask app context exists
        app = current_app._get_current_object()
    except RuntimeError:
        # Scheduler might trigger outside context → load manually
        from app import app
        ctx = app.app_context()
        ctx.push()

    try:
        rent = Rent.query.get(rent_id)
        if not rent:
            print(f"⚠️ Rent {rent_id} not found for auto-cancel.")
            return

        
        payment = Payment.query.filter_by(rent_id=rent_id).first()
        if payment:
            print(f"✅ Rent {rent_id} already paid, skipping auto-cancel.")
            return

        reservation = rent.reservation
        if reservation:
            if reservation.status == 'Cancelled':
                print(f"ℹ️ Reservation already cancelled for rent_id={rent_id}")
                return

            reservation.status = 'Cancelled'
            reservation.cancel_details = 'Auto-cancelled due to payment timeout'
            rent.status = 'Cancelled'

            vehicle = Vehicle.query.get(reservation.vehicle_id)
            if vehicle:
                vehicle.status = 'Available'

            availabilities = VehicleAvailability.query.filter_by(vehicle_id=vehicle.vehicle_id).all()
            for va in availabilities:
                if (
                    va.status == 'Booked'
                    and va.available_from <= reservation.end_date
                    and va.available_to >= reservation.start_date
                ):
                    va.status = 'Available'

        db.session.commit()
        print(f"⏳ Auto-cancelled unpaid rent_id={rent_id} after 2 minutes")

    except Exception as e:
        db.session.rollback()
        print(f"⚠️ Failed to auto-cancel rent {rent_id}: {e}")

    finally:
        # ✅ Pop context only if we manually pushed one
        if 'ctx' in locals():
            ctx.pop()


# ✅ MANUAL CANCELLATION ENDPOINT
def cancel_payment():
    """Manual cancellation by customer/admin (both paid & unpaid)."""
    data = request.get_json() or {}
    rent_id = data.get('rent_id')
    if not rent_id:
        return jsonify({'success': False, 'message': 'Missing rent_id'}), 400

    rent = Rent.query.get(rent_id)
    if not rent:
        return jsonify({'success': False, 'message': 'Rent not found'}), 404

    try:
        payment = Payment.query.filter_by(rent_id=rent_id).first()
        reservation = rent.reservation

        if reservation:
            reservation.status = 'Cancelled'
            reservation.cancel_details = (
                'Cancelled manually after payment (user-initiated)'
                if payment else 'Cancelled manually before payment'
            )

        vehicle = Vehicle.query.get(reservation.vehicle_id) if reservation else None
        if vehicle:
            vehicle.status = 'Available'

        availabilities = VehicleAvailability.query.filter_by(vehicle_id=vehicle.vehicle_id).all()
        for va in availabilities:
            if (
                va.status == 'Booked'
                and va.available_from <= reservation.end_date
                and va.available_to >= reservation.start_date
            ):
                va.status = 'Available'

        # Delete only unpaid rents
        if not payment:
            db.session.delete(rent)

        db.session.commit()

        # Remove pending job if exists
        with current_app.app_context():
            scheduler = getattr(current_app, "scheduler", None)
            if scheduler:
                try:
                    scheduler.remove_job(f"payment_timeout_{rent_id}")
                except Exception:
                    pass

        print(f"🚫 Rent {rent_id} cancelled manually ({'after payment' if payment else 'before payment'}).")
        return jsonify({'success': True, 'message': 'Booking cancelled successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print("❌ Error in cancel_payment:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
