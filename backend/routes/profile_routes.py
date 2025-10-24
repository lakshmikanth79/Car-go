from flask import Blueprint

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/test', methods=['GET'])
def test_route():
    return "Profile Route Working!"
