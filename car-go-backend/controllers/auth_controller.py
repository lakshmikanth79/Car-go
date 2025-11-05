from models import db
from models.customer import Customer
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date

def register():
    data = request.get_json() or {}
    required = ['cust_name','cust_email','password']
    for r in required:
        if not data.get(r):
            return jsonify({"success":False,"message":f"Missing {r}"}),400

    if Customer.query.filter_by(cust_email=data['cust_email']).first():
        return jsonify({"success":False,"message":"Email already registered"}),400

    hashed = generate_password_hash(data['password'])
    cust = Customer(
        cust_name=data.get('cust_name'),
        cust_email=data.get('cust_email'),
        cust_phone=data.get('cust_phone'),
        cust_address=data.get('cust_address'),
        driving_license_no=data.get('driving_license_no'),
        password=hashed
    )
    db.session.add(cust)
    db.session.commit()
    return jsonify({"success":True,"message":"Registered","cust_id":cust.cust_id}),201

def login():
    data = request.get_json() or {}
    email = data.get('cust_email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"success":False,"message":"Missing credentials"}),400
    user = Customer.query.filter_by(cust_email=email).first()
    if not user or not check_password_hash(user.password or '', password):
        return jsonify({"success":False,"message":"Invalid credentials"}),401
    # In production return JWT/session token. Here return basic user object.
    return jsonify({"success":True,"cust_id":user.cust_id,"cust_name":user.cust_name}),200
