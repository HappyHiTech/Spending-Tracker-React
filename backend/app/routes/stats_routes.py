from flask import Flask, request, Response, Blueprint, jsonify
from flask_cors import cross_origin
from app.database_manager import DataBaseManager
from app.jwt_manager import JWTManager
from app.stats_manager import StatsManager
import uuid

DBM = DataBaseManager()
JWTM = JWTManager()
SM = StatsManager(DBM.db())

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/api/get_total_spent", methods=["POST"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def get_total_spent():
    user_id = request.user_id
    view = request.args.get('view', 'all')  # Default to 'all' if not specified
    total_spent = SM.total_price(user_id, view)
    return jsonify({"total_spent": total_spent})

@stats_bp.route("/api/get_percent_per_category", methods=["POST"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def get_percent_per_category():
    user_id = request.user_id
    view = request.args.get('view', 'all')  # Default to 'all' if not specified
    category_dict = SM.get_percent_per_category(user_id, view)
    return jsonify(category_dict)


@stats_bp.route("/api/get_price_per_category", methods=["POST"])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://happyhitech.github.io"])
@JWTM.verify_jwt
def get_price_per_category():
    user_id = request.user_id
    view = request.args.get('view', 'all')  # Default to 'all' if not specified
    category_dict = SM.get_price_per_category(user_id, view)
    return jsonify(category_dict)