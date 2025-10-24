from flask import jsonify
from models.vehicle_model import Vehicle

def get_all_vehicles():
    vehicles = Vehicle.get_all()
    return jsonify({"success": True, "vehicles": vehicles}), 200

def get_vehicle(vehicle_id):
    vehicle = Vehicle.get_by_id(vehicle_id)
    if vehicle:
        return jsonify({"success": True, "vehicle": vehicle}), 200
    else:
        return jsonify({"success": False, "message": "Vehicle not found"}), 404
