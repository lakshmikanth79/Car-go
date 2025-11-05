from flask import Blueprint, jsonify
from controllers.booking_controller import create_reservation, cancel_reservation
from controllers.booking_controller import create_reservation
from controllers.booking_controller import get_booking_by_rent
from models.reservation import Reservation

booking_bp = Blueprint('booking', __name__)

booking_bp.add_url_rule('/', 'create_reservation', create_reservation, methods=['POST'])
booking_bp.add_url_rule('/cancel/<int:reservation_id>', 'cancel_reservation', cancel_reservation, methods=['POST'])
booking_bp.add_url_rule('/rent/<int:rent_id>', 'get_booking_by_rent', get_booking_by_rent, methods=['GET'])


# list all bookings (admin / debug)
@booking_bp.route('/', methods=['GET'])
def list_all_bookings():
    items = Reservation.query.all()
    return jsonify([i.to_dict() for i in items])


@booking_bp.route('/<int:reservation_id>', methods=['GET'])
def get_booking(reservation_id):
    r = Reservation.query.get(reservation_id)
    if not r:
        return jsonify({"error": "Not found"}), 404
    return jsonify(r.to_dict())
