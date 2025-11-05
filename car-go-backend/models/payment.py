from . import db
class Payment(db.Model):
    __tablename__ = 'payment'
    payment_id = db.Column(db.Integer, primary_key=True)
    rent_id = db.Column(db.Integer, db.ForeignKey('rent.rent_id'), nullable=False)
    cust_id = db.Column(db.Integer, db.ForeignKey('customer.cust_id'), nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.Enum('Cash','Card','Online'), nullable=False)
    amount = db.Column(db.Numeric(10,2), nullable=False)

    customer = db.relationship('Customer', back_populates='payments')
    rent = db.relationship('Rent', back_populates='payments')

    def to_dict(self):
        return {
            "payment_id": self.payment_id,
            "rent_id": self.rent_id,
            "cust_id": self.cust_id,
            "payment_date": str(self.payment_date),
            "payment_method": self.payment_method,
            "amount": float(self.amount)
        }
