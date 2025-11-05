from . import db
class Vehicle(db.Model):
    __tablename__ = 'vehicle'
    vehicle_id = db.Column(db.Integer, primary_key=True)
    reg_no = db.Column(db.String(20), unique=True, nullable=False)
    model = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(100))
    manufacture_year = db.Column(db.Integer, default=2022)
    vehicle_type = db.Column(db.Enum('Car','Bike','SUV','Van'))
    status = db.Column(db.Enum('Available','Rented','Maintenance'), default='Available')
    emp_id = db.Column(db.Integer, db.ForeignKey('employee.emp_id'))
    rent_per_day = db.Column(db.Numeric(10,2), nullable=False, default=0.00)

    employee = db.relationship('Employee', back_populates='vehicles')
    availability = db.relationship('VehicleAvailability', back_populates='vehicle', cascade='all, delete-orphan')
    reservations = db.relationship('Reservation', back_populates='vehicle')

    def to_dict(self):
        return {
            "vehicle_id": self.vehicle_id,
            "reg_no": self.reg_no,
            "model": self.model,
            "brand": self.brand,
            "manufacture_year": self.manufacture_year,
            "vehicle_type": self.vehicle_type,
            "status": self.status,
            "emp_id": self.emp_id,
            "rent_per_day": float(self.rent_per_day)
        }
