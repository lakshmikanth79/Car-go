from . import db
class VehicleAvailability(db.Model):
    __tablename__ = 'vehicleavailability'
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.vehicle_id'), primary_key=True)
    available_from = db.Column(db.Date, primary_key=True)
    available_to = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('Available','Booked'), default='Available')
    last_updated = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    vehicle = db.relationship('Vehicle', back_populates='availability')

    def to_dict(self):
        return {
            "vehicle_id": self.vehicle_id,
            "available_from": str(self.available_from),
            "available_to": str(self.available_to),
            "status": self.status
        }
