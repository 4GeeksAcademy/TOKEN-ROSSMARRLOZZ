"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

api = Blueprint('api', __name__)

# This will store the revoked tokens
delete_tokens = set()  # Use a set to store revoked token IDs (jti)

def user_exists(email):
    user = User.query.filter_by(email=email).first() 
    return user is not None

def create_user(email, password):
    new_user = User(email=email)
    new_user.set_password(password) 
    db.session.add(new_user)  
    db.session.commit() 

# Allow CORS requests to this API
CORS(api, origins=["https://scary-wand-v6p499j44g69cp7jq-3000.app.github.dev"])

@api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello, World!"}), 200

# Create a route to authenticate your users and return JWTs. 
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password:
        return jsonify({"msg": "Se requieren correo electrónico y contraseña"}), 400

    # Busca el usuario por el correo electrónico
    user = User.query.filter_by(email=email).first()

    # Verifica si el usuario existe y si la contraseña es correcta
    if user is None or not user.check_password(password):
        return jsonify({"msg": "Nombre de usuario o contraseña incorrectos"}), 401

    # Crea el token JWT
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    delete_tokens.add(jti)
    return jsonify({"msg": "Cierre de sesión exitoso"}), 200

@api.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Se requieren correo electrónico y contraseña"}), 400

    if user_exists(email):  
        return jsonify({"msg": "El usauario ya existe"}), 400

    try:
        create_user(email, password)  
        return jsonify({"msg": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        print(f"Error creating user: {e}") 
        return jsonify({"msg": "Error Interno del Servidor"}), 500

@api.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    return jsonify({"msg": "Token es válido"}), 200