from config.db import get_db_connection
import hashlib

class Customer:
    @staticmethod
    def hash_password(password):
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def register(cust_name, cust_email, cust_phone, cust_address, driving_license_no, password):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM customer WHERE cust_email = %s", (cust_email,))
        if cursor.fetchone():
            conn.close()
            return False, "Email already exists"

        hashed_pw = Customer.hash_password(password)
        cursor.execute("""
            INSERT INTO customer (cust_name, cust_email, cust_phone, cust_address, driving_license_no, password)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (cust_name, cust_email, cust_phone, cust_address, driving_license_no, hashed_pw))

        conn.commit()
        conn.close()
        return True, "Registered successfully"

    @staticmethod
    def login(cust_email, password):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        hashed_pw = Customer.hash_password(password)

        cursor.execute("SELECT * FROM customer WHERE cust_email = %s AND password = %s", (cust_email, hashed_pw))
        user = cursor.fetchone()
        conn.close()
        return user
