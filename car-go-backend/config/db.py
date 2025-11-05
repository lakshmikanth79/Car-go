# DB helpers (not required when using SQLAlchemy models directly)
def get_db_connection():
    import mysql.connector, os
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST','localhost'),
        user=os.getenv('DB_USER','root'),
        password=os.getenv('DB_PASSWORD',''),
        database=os.getenv('DB_NAME','car_rental_system'),
        port=int(os.getenv('DB_PORT','3306'))
    )
    return conn
