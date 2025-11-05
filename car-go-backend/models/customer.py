from . import db
class Customer(db.Model):
    __tablename__ = 'customer'
    cust_id = db.Column(db.Integer, primary_key=True)
    cust_name = db.Column(db.String(100), nullable=False)
    cust_email = db.Column(db.String(100), unique=True, nullable=False)
    cust_phone = db.Column(db.String(15))
    cust_address = db.Column(db.String(255))
    driving_license_no = db.Column(db.String(50))
    password = db.Column(db.String(255))

    reservations = db.relationship('Reservation', back_populates='customer', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='customer', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "cust_id": self.cust_id,
            "cust_name": self.cust_name,
            "cust_email": self.cust_email,
            "cust_phone": self.cust_phone,
            "cust_address": self.cust_address,
            "driving_license_no": self.driving_license_no
        }
