from . import db
class RentVehicle(db.Model):
    __tablename__ = 'rentvehicle'
    rent_id = db.Column(db.Integer, db.ForeignKey('rent.rent_id'), primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.vehicle_id'), primary_key=True)

    rent = db.relationship('Rent', back_populates='rentvehicles')
    vehicle = db.relationship('Vehicle')

    def to_dict(self):
        return {"rent_id": self.rent_id, "vehicle_id": self.vehicle_id}
