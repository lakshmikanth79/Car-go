from flask import Blueprint
from controllers.profile_controller import get_user_bookings, cancel_user_booking

profile_bp = Blueprint('profile_bp', __name__, url_prefix="/profile")

profile_bp.route('/<int:cust_id>', methods=['GET'])(get_user_bookings)
profile_bp.route('/cancel', methods=['POST'])(cancel_user_booking)
