from flask import request, jsonify
from models.payment_model import Payment
from models.rent_model import Rent
from models.rentvehicle_model import RentVehicle

def process_payment():
    data = request.json
    required_fields = ["reservation_id", "cust_id", "vehicle_id", "amount"]

    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing payment details"}), 400

    # Create rent record
    rent_id = Rent.create(data["reservation_id"], data["amount"])

    # Link rent and vehicle
    RentVehicle.link_vehicle(rent_id, data["vehicle_id"])

    # Store payment info
    Payment.create(rent_id, data["cust_id"], data["amount"])

    return jsonify({
        "success": True,
        "message": "Payment processed successfully",
        "rent_id": rent_id
    }), 200
