from flask import Blueprint

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/test', methods=['GET'])
def test_route():
    return "Booking Route Working!"
