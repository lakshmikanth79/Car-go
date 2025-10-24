from flask import Blueprint
from controllers.payment_controller import process_payment

payment_bp = Blueprint('payment_bp', __name__, url_prefix="/payment")

payment_bp.route('/process', methods=['POST'])(process_payment)
