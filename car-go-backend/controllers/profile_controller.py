from flask import jsonify, request
from datetime import date
from models import db
from models.reservation import Reservation
from models.payment import Payment
from models.vehicle import Vehicle


# ✅ Get all bookings for a user (only paid/confirmed ones in 'current')
def get_user_reservations(user_id):
    try:
        # 🔹 Fetch all reservations for user
        reservations = Reservation.query.filter_by(cust_id=user_id).all()
        if not reservations:
            return jsonify({'success': True, 'current': [], 'past': []}), 200

        current = []
        past = []

        for res in reservations:
            rent = res.rent
            payment = None
            if rent:
                payment = Payment.query.filter_by(rent_id=rent.rent_id).first()

            vehicle = Vehicle.query.get(res.vehicle_id)

            booking_info = {
                'reservation_id': res.reservation_id,
                'vehicle_name': f"{vehicle.brand} {vehicle.model}" if vehicle else "N/A",
                'start_date': str(res.start_date),
                'end_date': str(res.end_date),
                'status': res.status,
                'amount': float(payment.amount) if payment else None,
                'payment_done': True if payment else False
            }

            # 🔹 If payment exists & status is Booked → Current
            if payment and res.status == "Booked":
                current.append(booking_info)
            else:
                # 🔹 Otherwise (Cancelled, Completed, etc.) → Past
                past.append(booking_info)

        return jsonify({
            'success': True,
            'current': current,
            'past': past
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': str(e)}), 500


# ✅ Cancel a reservation (manual by user)
def cancel_user_reservation(reservation_id):
    try:
        res = Reservation.query.get(reservation_id)
        if not res:
            return jsonify({'success': False, 'message': 'Reservation not found'}), 404

        res.status = 'Cancelled'
        res.cancel_details = request.json.get('reason', 'Cancelled by user')

        # Free the vehicle again
        vehicle = Vehicle.query.get(res.vehicle_id)
        if vehicle:
            vehicle.status = 'Available'

        db.session.commit()
        return jsonify({'success': True, 'message': 'Booking cancelled successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
