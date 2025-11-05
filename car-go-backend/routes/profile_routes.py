from flask import Blueprint
from controllers.profile_controller import get_user_reservations, cancel_user_reservation

profile_bp = Blueprint('profile', __name__)

profile_bp.add_url_rule('/<int:user_id>', 'get_user_reservations', get_user_reservations, methods=['GET'])
profile_bp.add_url_rule('/cancel/<int:reservation_id>', 'cancel_user_reservation', cancel_user_reservation, methods=['POST'])
