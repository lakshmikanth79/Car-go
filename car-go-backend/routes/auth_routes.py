from flask import Blueprint, request
from controllers.auth_controller import register, login
auth_bp = Blueprint('auth', __name__)
auth_bp.add_url_rule('/register','register', register, methods=['POST'])
auth_bp.add_url_rule('/login','login', login, methods=['POST'])
