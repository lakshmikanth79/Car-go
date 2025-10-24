from flask import Blueprint
from controllers.auth_controller import register, login

auth_bp = Blueprint('auth_bp', __name__, url_prefix="/auth")

auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)

