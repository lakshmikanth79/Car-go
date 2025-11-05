from config.db import get_db_connection
from datetime import date

class Rent:
    @staticmethod
    def create(reservation_id, total_amount):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO rent (reservation_id, rent_date, total_amount)
            VALUES (%s, %s, %s)
        """, (reservation_id, date.today(), total_amount))
        rent_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return rent_id
