from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message
import os

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def contact_form():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not (name and email and message):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    try:
        mail = current_app.extensions['mail']
        msg = Message(
            subject=f"📩 New Contact Message from {name}",
            sender=os.getenv("EMAIL_USER"),
            recipients=["lakshmikanth.s2023@vitstudent.ac.in"],
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        )
        mail.send(msg)
        return jsonify({"success": True, "message": "Email sent successfully!"})
    except Exception as e:
        print("⚠️ Email send error:", e)
        return jsonify({"success": False, "message": "Failed to send email"}), 500
