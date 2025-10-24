from flask import request, jsonify
from models.reservation_model import Reservation
from models.vehicleavailability_model import VehicleAvailability
from models.employee_model import Employee

def create_booking():
    data = request.json
    required_fields = ["cust_id", "vehicle_id", "start_date", "end_date", "pickup_location"]

    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Assign the employee handling this vehicle
    employee = Employee.get_employee_by_vehicle(data["vehicle_id"])
    emp_id = employee["emp_id"] if employee else None

    reservation_id = Reservation.create(
        data["cust_id"],
        emp_id,
        data["vehicle_id"],
        data["start_date"],
        data["end_date"],
        data["pickup_location"]
    )

    # Mark vehicle as booked
    VehicleAvailability.update_status(data["vehicle_id"], "Booked")

    return jsonify({
        "success": True,
        "message": "Booking created successfully",
        "reservation_id": reservation_id
    }), 200


def cancel_booking():
    data = request.json
    reservation_id = data.get("reservation_id")

    if not reservation_id:
        return jsonify({"success": False, "message": "Reservation ID missing"}), 400

    Reservation.cancel(reservation_id)
    return jsonify({"success": True, "message": "Booking cancelled successfully"}), 200
