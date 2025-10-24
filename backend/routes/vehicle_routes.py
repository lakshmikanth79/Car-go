from flask import Blueprint

vehicle_bp = Blueprint('vehicle', __name__)

@vehicle_bp.route('/test', methods=['GET'])
def test_route():
    return "Vehicle Route Working!"
