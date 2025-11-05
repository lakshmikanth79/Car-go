from flask import Blueprint, request, jsonify
from controllers.payment_controller import create_payment, cancel_payment
from models.payment import Payment
from models.rent import Rent
from models.reservation import Reservation
from models.vehicle import Vehicle
from models.customer import Customer
from models import db

payment_bp = Blueprint('payment', __name__)

# ✅ 1️⃣ Create a new payment (on success)
payment_bp.add_url_rule('/', 'create_payment', create_payment, methods=['POST'])

# ✅ 2️⃣ Cancel payment / booking (on failure)
payment_bp.add_url_rule('/cancel', 'cancel_payment', cancel_payment, methods=['POST'])

# ✅ 3️⃣ Fetch payment + booking details (for confirmation page)
@payment_bp.route('/<int:rent_id>', methods=['GET'])
def get_payment_details(rent_id):
    try:
        # 1️⃣ Fetch the Rent record
        rent = Rent.query.get(rent_id)
        if not rent:
            return {'success': False, 'message': 'Rent record not found'}, 404

        # 2️⃣ Fetch Reservation from rent
        reservation = Reservation.query.get(rent.reservation_id)
        if not reservation:
            return {'success': False, 'message': 'Reservation not found for this rent'}, 404

        # 3️⃣ Get related records
        payment = Payment.query.filter_by(rent_id=rent_id).first()
        vehicle = Vehicle.query.get(reservation.vehicle_id)
        customer = Customer.query.get(reservation.cust_id)

        if not payment:
            return {'success': False, 'message': 'Payment not found for this booking'}, 404

        # 4️⃣ Build response
        data = {
            'success': True,
            'payment': {
                'payment_id': payment.payment_id,
                'rent_id': rent_id,
                'payment_date': str(payment.payment_date),
                'payment_method': payment.payment_method,
                'amount': payment.amount,
                'customer_name': customer.cust_name if customer else "N/A",
                'vehicle_name': f"{vehicle.brand} {vehicle.model}" if vehicle else "N/A",
                'start_date': str(reservation.start_date),
                'end_date': str(reservation.end_date)
            }
        }
        return jsonify(data), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {'success': False, 'message': str(e)}, 500
