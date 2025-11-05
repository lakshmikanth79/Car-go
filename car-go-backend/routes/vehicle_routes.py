from flask import Blueprint
from controllers.vehicle_controller import get_all_vehicles, get_vehicle
vehicle_bp = Blueprint('vehicle', __name__)
vehicle_bp.add_url_rule('/','list_vehicles', get_all_vehicles, methods=['GET'])
vehicle_bp.add_url_rule('/<int:vehicle_id>','get_vehicle', get_vehicle, methods=['GET'])
