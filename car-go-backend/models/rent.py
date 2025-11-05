from . import db
class Rent(db.Model):
    __tablename__ = 'rent'
    rent_id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservation.reservation_id'), unique=True, nullable=False)
    rent_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Numeric(10,2), nullable=False)

    reservation = db.relationship('Reservation', back_populates='rent')
    rentvehicles = db.relationship('RentVehicle', back_populates='rent', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='rent')

    def to_dict(self):
        return {
            "rent_id": self.rent_id,
            "reservation_id": self.reservation_id,
            "rent_date": str(self.rent_date),
            "total_amount": float(self.total_amount)
        }
