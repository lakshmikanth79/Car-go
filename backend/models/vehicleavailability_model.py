from config.db import get_db_connection

class VehicleAvailability:
    @staticmethod
    def update_status(vehicle_id, status):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE vehicleavailability 
            SET status = %s 
            WHERE vehicle_id = %s
        """, (status, vehicle_id))
        conn.commit()
        conn.close()
        return True
