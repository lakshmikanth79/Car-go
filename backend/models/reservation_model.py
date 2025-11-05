from config.db import get_db_connection
from datetime import date

class Reservation:
    @staticmethod
    def create(cust_id, emp_id, vehicle_id, start_date, end_date, pickup_location):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO reservation (cust_id, emp_id, vehicle_id, reservation_date, start_date, end_date, status, pickup_location)
            VALUES (%s, %s, %s, %s, %s, %s, 'Booked', %s)
        """, (cust_id, emp_id, vehicle_id, date.today(), start_date, end_date, pickup_location))
        conn.commit()
        reservation_id = cursor.lastrowid
        conn.close()
        return reservation_id

    @staticmethod
    def cancel(reservation_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE reservation 
            SET status='Cancelled', cancel_details='User cancelled the booking' 
            WHERE reservation_id=%s
        """, (reservation_id,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_by_customer(cust_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT r.reservation_id, r.start_date, r.end_date, r.status, 
                   v.model, v.brand, v.rent_per_day, v.vehicle_type
            FROM reservation r
            JOIN vehicle v ON r.vehicle_id = v.vehicle_id
            WHERE r.cust_id = %s
        """, (cust_id,))
        data = cursor.fetchall()
        conn.close()
        return data
