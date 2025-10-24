# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config.db import get_db_connection
from routes.auth_routes import auth_bp
from routes.vehicle_routes import vehicle_bp
from routes.booking_routes import booking_bp
from routes.payment_routes import payment_bp
from routes.profile_routes import profile_bp

app = Flask(__name__)
CORS(app)  # Allow frontend JS to access backend APIs

# Register route blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(vehicle_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(profile_bp)

# Default route
@app.route('/')
def home():
    return "🚗 Car-Go Backend is Running Successfully!"

# Database test route
@app.route('/dbtest')
def dbtest():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify({"status": "connected", "tables": tables})
    else:
        return jsonify({"status": "failed to connect"})

if __name__ == '__main__':
    app.run(debug=True)
