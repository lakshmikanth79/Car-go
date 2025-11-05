from . import db
class Reservation(db.Model):
    __tablename__ = 'reservation'
    reservation_id = db.Column(db.Integer, primary_key=True)
    cust_id = db.Column(db.Integer, db.ForeignKey('customer.cust_id'), nullable=False)
    emp_id = db.Column(db.Integer, db.ForeignKey('employee.emp_id'), nullable=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.vehicle_id'), nullable=True)
    reservation_date = db.Column(db.Date, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('Booked','Cancelled','Completed'), default='Booked')
    pickup_location = db.Column(db.String(100))
    cancel_details = db.Column(db.String(255), default='Not Cancelled', nullable=False)

    customer = db.relationship('Customer', back_populates='reservations')
    employee = db.relationship('Employee')
    vehicle = db.relationship('Vehicle', back_populates='reservations')
    rent = db.relationship('Rent', back_populates='reservation', uselist=False)

    def to_dict(self):
        return {
            "reservation_id": self.reservation_id,
            "cust_id": self.cust_id,
            "emp_id": self.emp_id,
            "vehicle_id": self.vehicle_id,
            "reservation_date": str(self.reservation_date),
            "start_date": str(self.start_date),
            "end_date": str(self.end_date),
            "status": self.status,
            "pickup_location": self.pickup_location,
            "cancel_details": self.cancel_details
        }
