from config.db import get_db_connection

class Vehicle:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT v.vehicle_id, v.brand, v.model, v.vehicle_type, v.status, v.rent_per_day,
                   va.available_from, va.available_to, e.emp_name
            FROM vehicle v
            LEFT JOIN vehicleavailability va ON v.vehicle_id = va.vehicle_id
            LEFT JOIN employee e ON v.emp_id = e.emp_id
        """)
        vehicles = cursor.fetchall()
        conn.close()
        return vehicles

    @staticmethod
    def get_by_id(vehicle_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT v.vehicle_id, v.brand, v.model, v.vehicle_type, v.status, v.rent_per_day,
                   va.available_from, va.available_to, e.emp_name
            FROM vehicle v
            LEFT JOIN vehicleavailability va ON v.vehicle_id = va.vehicle_id
            LEFT JOIN employee e ON v.emp_id = e.emp_id
            WHERE v.vehicle_id = %s
        """, (vehicle_id,))
        vehicle = cursor.fetchone()
        conn.close()
        return vehicle
