from config.db import get_db_connection
from datetime import date

class Payment:
    @staticmethod
    def create(rent_id, cust_id, amount):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO payment (rent_id, cust_id, payment_date, payment_method, amount)
            VALUES (%s, %s, %s, 'Card', %s)
        """, (rent_id, cust_id, date.today(), amount))
        conn.commit()
        conn.close()
        return True
