from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail
from models import db
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from datetime import date
from models.vehicle import Vehicle
from models.reservation import Reservation
import os
from dotenv import load_dotenv

# -----------------------------
# ✅ Global setup (before app)
# -----------------------------
load_dotenv()

scheduler = BackgroundScheduler(timezone='UTC')
scheduler.start()

mail = Mail()  # ✅ Initialize globally

# Optional: Scheduler listener
def job_listener(event):
    if event.exception:
        print(f"⚠️ Job {event.job_id} failed: {event.exception}")
    else:
        print(f"✅ Job {event.job_id} executed successfully")

scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)


# -----------------------------
# ✅ Flask App Factory
# -----------------------------
def create_app():
    app = Flask(__name__, static_folder=None)
    CORS(app)
    app.config.from_prefixed_env()

    # Database configuration
    user = os.getenv('DB_USER', 'root')
    pw = os.getenv('DB_PASSWORD', '')
    host = os.getenv('DB_HOST', 'localhost')
    port = os.getenv('DB_PORT', '3306')
    dbn = os.getenv('DB_NAME', 'car_rental_system')

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{user}:{pw}@{host}:{port}/{dbn}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-me')

    # ✅ Email configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
    app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)  # ✅ Use global mail instance
    Migrate(app, db)
    app.scheduler = scheduler

    # Import blueprints
    from routes.auth_routes import auth_bp
    from routes.vehicle_routes import vehicle_bp
    from routes.booking_routes import booking_bp
    from routes.payment_routes import payment_bp
    from routes.profile_routes import profile_bp
    from routes.contact import contact_bp

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vehicle_bp, url_prefix='/api/vehicles')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(contact_bp)

    # 🔁 Refresh vehicle statuses
    def refresh_vehicle_statuses():
        with app.app_context():
            today = date.today()
            vehicles = Vehicle.query.all()

            for v in vehicles:
                active_booking = Reservation.query.filter(
                    Reservation.vehicle_id == v.vehicle_id,
                    Reservation.status == 'Booked',
                    Reservation.start_date <= today,
                    Reservation.end_date >= today
                ).first()
                v.status = 'Rented' if active_booking else 'Available'

            db.session.commit()
            print("✅ Vehicle statuses refreshed based on date")

    scheduler.add_job(refresh_vehicle_statuses, 'cron', hour=0, minute=0)

    # 🧹 Clean expired reservations
    with app.app_context():
        today = date.today()
        expired_reservations = Reservation.query.filter(
            Reservation.status == 'Booked',
            Reservation.end_date < today
        ).all()
        for r in expired_reservations:
            r.status = 'Completed'
        db.session.commit()
        print("🧹 Cleaned up expired 'Booked' reservations")

    # Serve images
    @app.route('/images/<path:filename>')
    def serve_images(filename):
        image_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'images')
        return send_from_directory(os.path.abspath(image_dir), filename)

    @app.route('/')
    def index():
        return jsonify({"status": "ok", "message": "Car-Go backend running"})

    return app


# -----------------------------
# ✅ Global app instance
# -----------------------------
app = create_app()


# -----------------------------
# ✅ Entry point
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
