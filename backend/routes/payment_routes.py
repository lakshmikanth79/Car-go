from flask import Blueprint

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/test', methods=['GET'])
def test_route():
    return "Payment Route Working!"
