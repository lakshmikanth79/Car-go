from flask import jsonify, request
from models.reservation_model import Reservation

def get_user_bookings(cust_id):
    bookings = Reservation.get_by_customer(cust_id)
    return jsonify({"success": True, "bookings": bookings}), 200


def cancel_user_booking():
    data = request.json
    reservation_id = data.get("reservation_id")

    if not reservation_id:
        return jsonify({"success": False, "message": "Reservation ID missing"}), 400

    Reservation.cancel(reservation_id)
    return jsonify({"success": True, "message": "Booking cancelled successfully"}), 200
