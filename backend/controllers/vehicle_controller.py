from flask import Blueprint, jsonify, request
from models.vehicle_model import Vehicle
from models.vehicleavailability_model import VehicleAvailability

# Create blueprint
vehicle_bp = Blueprint('vehicle_bp', __name__, url_prefix="/vehicle")

# ✅ Get all vehicles
@vehicle_bp.route('/all', methods=['GET'])
def get_all_vehicles():
    vehicles = Vehicle.get_all()

    # Normalize and format data for frontend
    for v in vehicles:
        # 'Available' -> True, 'Booked' -> False
        v["is_available"] = str(v.get("status", "")).lower() == "available"
        v["type"] = v.get("vehicle_type", "")
    
    return jsonify({"success": True, "vehicles": vehicles}), 200


# ✅ Get one vehicle by ID
@vehicle_bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.get_by_id(vehicle_id)
    if vehicle:
        vehicle["is_available"] = str(vehicle.get("status", "")).lower() == "available"
        vehicle["type"] = vehicle.get("vehicle_type", "")
        return jsonify({"success": True, "vehicle": vehicle}), 200
    else:
        return jsonify({"success": False, "message": "Vehicle not found"}), 404


# ✅ Update vehicle availability (PUT)
@vehicle_bp.route('/update/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    try:
        data = request.get_json()

        if data is None:
            return jsonify({"success": False, "message": "No JSON body found"}), 400

        # Extract and interpret availability from frontend
        is_available = data.get("is_available", True)

        # ✅ Match ENUM('Available', 'Booked') exactly as in your MySQL schema
        new_status = "Available" if is_available else "Booked"

        # Update the status in the vehicleavailability table
        VehicleAvailability.update_status(vehicle_id, new_status)

        return jsonify({
            "success": True,
            "message": f"Vehicle {vehicle_id} marked as {new_status}"
        }), 200

    except Exception as e:
        print("⚠️ Error updating vehicle:", e)
        return jsonify({
            "success": False,
            "message": f"Server error while updating vehicle status: {str(e)}"
        }), 500
