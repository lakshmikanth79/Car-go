from models.vehicle import Vehicle
from models.vehicleavailability import VehicleAvailability
from models.employee import Employee
from flask import jsonify

def get_all_vehicles():
    vehicles = Vehicle.query.all()
    out = []
    for v in vehicles:
        avails = [a.to_dict() for a in v.availability]
        emp = v.employee.to_dict() if v.employee else None
        d = v.to_dict()
        d['availability'] = avails
        d['employee'] = emp
        out.append(d)
    return jsonify(out)

def get_vehicle(vehicle_id):
    v = Vehicle.query.get(vehicle_id)
    if not v:
        return jsonify({"error":"Not found"}),404
    d = v.to_dict()
    d['availability'] = [a.to_dict() for a in v.availability]
    d['employee'] = v.employee.to_dict() if v.employee else None
    return jsonify(d)
