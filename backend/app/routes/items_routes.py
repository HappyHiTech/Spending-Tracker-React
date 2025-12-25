from flask import Flask, request, Response, Blueprint, jsonify
from flask_cors import cross_origin
from app.database_manager import DataBaseManager
from app.jwt_manager import JWTManager
from app.stats_manager import StatsManager
import uuid

DBM = DataBaseManager()
JWTM = JWTManager()
SM = StatsManager(DBM.db())

item_bp = Blueprint("item", __name__)


@item_bp.route('/api/message')
def temp():
    print("hellooo")
    return Response("OK", status=200)

@item_bp.route('/api/get_data')
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def get_data():
    user_id = request.user_id
    view = request.args.get('view', 'all')  # Default to 'all' if not specified
    
    if view == 'monthly':
        item_list = DBM.get_month_documents(user_id)
    else:
        item_list = DBM.get_documents(user_id)
    
    return jsonify(item_list)

@item_bp.route('/api/get_month_data')
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def get_month_data():
    user_id = request.user_id
    item_list = DBM.get_month_documents(user_id)
    return jsonify(item_list)


@item_bp.route('/api/add_data', methods=["POST"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def add_data():
    user_id = request.user_id
    DBM.insert_transaction(user_id, request.form)
    item_list = DBM.get_month_documents(user_id)
    total_spent = SM.total_price(user_id)
    item_list.append(total_spent)
    return jsonify(item_list)


@item_bp.route('/api/remove_data', methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def remove_data():
    user_id = request.user_id
    data = request.get_json()
    item_id = data.get("item_id")
    DBM.delete_docuement(item_id)   
    item_list = DBM.get_documents(user_id)
    total_spent = SM.total_price(user_id)
    item_list.append(total_spent)
    return jsonify(item_list)