from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# import models to register with SQLAlchemy
from .customer import Customer
from .employee import Employee
from .vehicle import Vehicle
from .vehicleavailability import VehicleAvailability
from .reservation import Reservation
from .rent import Rent
from .rentvehicle import RentVehicle
from .payment import Payment
