from flask import Blueprint
from controllers.vehicle_controller import get_all_vehicles, get_vehicle

vehicle_bp = Blueprint('vehicle_bp', __name__, url_prefix="/vehicle")

vehicle_bp.route('/all', methods=['GET'])(get_all_vehicles)
vehicle_bp.route('/<int:vehicle_id>', methods=['GET'])(get_vehicle)
