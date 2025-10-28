from flask import request, jsonify
from models.payment_model import Payment
from models.rent_model import Rent
from models.rentvehicle_model import RentVehicle

def process_payment():
    data = request.get_json()

    required_fields = ["reservation_id", "cust_id", "vehicle_id", "amount", "payment_method"]
    if not data or not all(field in data for field in required_fields):
        print("DEBUG: Received data ->", data)  # Optional debug line
        return jsonify({"success": False, "message": "Missing payment details"}), 400

    try:
        # Create rent record
        rent_id = Rent.create(data["reservation_id"], data["amount"])

        # Link rent and vehicle
        RentVehicle.link_vehicle(rent_id, data["vehicle_id"])

        # Store payment info
        Payment.create(
            rent_id,
            data["cust_id"],
            data["amount"],
            data["payment_method"]
        )

        return jsonify({
            "success": True,
            "message": "Payment processed successfully",
            "rent_id": rent_id
        }), 200

    except Exception as e:
        print("Error in process_payment:", e)
        return jsonify({"success": False, "message": str(e)}), 500
