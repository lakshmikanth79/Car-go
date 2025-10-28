from config.db import get_db_connection
from datetime import date

class Payment:
    @staticmethod
    def create(rent_id, cust_id, amount, payment_method="Card"):
        """Insert a new payment record into the database."""
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO payment (rent_id, cust_id, payment_date, payment_method, amount)
            VALUES (%s, %s, %s, %s, %s)
        """, (rent_id, cust_id, date.today(), payment_method, amount))

        conn.commit()
        cursor.close()
        conn.close()
        return True
