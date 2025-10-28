from flask import Blueprint
from controllers.vehicle_controller import get_all_vehicles, get_vehicle, update_vehicle

vehicle_bp = Blueprint('vehicle_bp', __name__, url_prefix="/vehicle")

# Fetch all vehicles
vehicle_bp.route('/all', methods=['GET'])(get_all_vehicles)

# Fetch single vehicle by ID
vehicle_bp.route('/<int:vehicle_id>', methods=['GET'])(get_vehicle)

# ✅ Update vehicle availability (PUT)
vehicle_bp.route('/update/<int:vehicle_id>', methods=['PUT'])(update_vehicle)
