from flask import Blueprint
from controllers.booking_controller import create_booking, cancel_booking

booking_bp = Blueprint('booking_bp', __name__, url_prefix="/booking")

booking_bp.route('/create', methods=['POST'])(create_booking)
booking_bp.route('/cancel', methods=['POST'])(cancel_booking)
