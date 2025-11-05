from . import db
class Employee(db.Model):
    __tablename__ = 'employee'
    emp_id = db.Column(db.Integer, primary_key=True)
    emp_name = db.Column(db.String(100), nullable=False)
    emp_email = db.Column(db.String(100), unique=True, nullable=False)
    emp_phone = db.Column(db.String(15))
    emp_role = db.Column(db.Enum('Manager','Staff'), default='Staff')
    manager_id = db.Column(db.Integer, db.ForeignKey('employee.emp_id'), nullable=True)

    managed = db.relationship('Employee', remote_side=[emp_id])
    vehicles = db.relationship('Vehicle', back_populates='employee')

    def to_dict(self):
        return {
            "emp_id": self.emp_id,
            "emp_name": self.emp_name,
            "emp_email": self.emp_email,
            "emp_phone": self.emp_phone,
            "emp_role": self.emp_role
        }
