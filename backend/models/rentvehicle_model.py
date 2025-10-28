from config.db import get_db_connection

class RentVehicle:
    @staticmethod
    def link_vehicle(rent_id, vehicle_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO rentvehicle (rent_id, vehicle_id)
            VALUES (%s, %s)
        """, (rent_id, vehicle_id))
        conn.commit()
        conn.close()
        return True
