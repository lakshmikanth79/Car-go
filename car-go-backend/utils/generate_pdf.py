from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
def generate_receipt(path, booking, payment):
    c = canvas.Canvas(path, pagesize=letter)
    c.setFont('Helvetica', 12)
    c.drawString(50,750, f"Receipt for Booking ID: {booking.get('reservation_id')}")
    c.drawString(50,730, f"Customer: {booking.get('cust_name','-')}")
    c.drawString(50,710, f"Vehicle: {booking.get('vehicle_model','-')}")
    c.drawString(50,690, f"Start: {booking.get('start_date')}  End: {booking.get('end_date')}")
    c.drawString(50,670, f"Amount Paid: {payment.get('amount')}")
    c.save()
