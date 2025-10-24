from flask import Flask, jsonify
from flask_cors import CORS
from config.db import get_db_connection
from routes.auth_routes import auth_bp
from routes.vehicle_routes import vehicle_bp
from routes.booking_routes import booking_bp
from routes.payment_routes import payment_bp
from routes.profile_routes import profile_bp

def create_app():
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)
    CORS(app)  # Allow frontend JavaScript to access backend APIs

    # Register Blueprints (routes)
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicle_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(profile_bp)

    # Default route
    @app.route('/')
    def home():
        return jsonify({"message": "Car-Go Backend is Running Successfully!"})

    # Database connection test route
    @app.route('/dbtest')
    def dbtest():
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES;")
            tables = [table[0] for table in cursor.fetchall()]
            cursor.close()
            connection.close()
            return jsonify({"status": "connected", "tables": tables})
        else:
            return jsonify({"status": "failed to connect"})

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
