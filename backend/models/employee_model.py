from config.db import get_db_connection

class Employee:
    @staticmethod
    def get_employee_by_vehicle(vehicle_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.emp_id, e.emp_name, e.emp_email, e.emp_phone, e.emp_role
            FROM employee e
            JOIN vehicle v ON e.emp_id = v.emp_id
            WHERE v.vehicle_id = %s
        """, (vehicle_id,))
        emp = cursor.fetchone()
        conn.close()
        return emp
