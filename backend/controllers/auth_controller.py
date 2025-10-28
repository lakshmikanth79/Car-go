from flask import request, jsonify
from models.customer_model import Customer

def register():
    data = request.json
    required_fields = ["cust_name", "cust_email", "cust_phone", "cust_address", "driving_license_no", "password"]
    
    # Validate input
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    success, message = Customer.register(
        data["cust_name"],
        data["cust_email"],
        data["cust_phone"],
        data["cust_address"],
        data["driving_license_no"],
        data["password"]
    )

    return jsonify({"success": success, "message": message}), (200 if success else 400)


def login():
    data = request.json
    email = data.get("cust_email")
    password = data.get("password")

    user = Customer.login(email, password)
    if user:
        return jsonify({"success": True, "message": "Login successful", "user": user}), 200
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
