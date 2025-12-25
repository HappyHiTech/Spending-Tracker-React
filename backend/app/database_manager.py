from dotenv import load_dotenv, find_dotenv
import os 
import pprint
from pymongo import MongoClient
from pymongo.database import Database as MongoDatabase
from werkzeug.datastructures import ImmutableMultiDict
from datetime import datetime
import jwt
import bcrypt
from bson import ObjectId

class DataBaseManager:
    def __init__(self):
        load_dotenv(find_dotenv())
        self._password = os.environ.get("MONGODB_PWD")
        self._connection_string = f"mongodb+srv://harveycytan:{self._password}@spender-clustor.maoqfo6.mongodb.net/?retryWrites=true&w=majority&appName=Spender-Clustor"
        self._client = MongoClient(self._connection_string)
        self._db = self._client["SpenderDB"]

    def client(self) -> MongoClient:
        return self._client
    
    def db(self) -> MongoDatabase:
        return self._db
    
    def delete_all_documents(self, collection_name: str) -> None:
        collection = self._db[collection_name]
        collection.delete_many({})
    
    def insert_transaction(self, user_id: str, form_data: ImmutableMultiDict) -> None:
        transaction_collection = self._db["transactions"]
        entry_document = {
            "user_id": user_id,
            "date": form_data["date"],
            "item": form_data["item"],
            "price": form_data["price"],
            "category": form_data["category"]
        }

        transaction_collection.insert_one(entry_document)

    def delete_docuement(self, item_id: str) -> None:
        transaction_collection = self._db["transactions"]
        oid = ObjectId(item_id)
        transaction_collection.delete_one({'_id': oid})
        

    def get_documents(self, user_id: str) -> list:
        transaction_collection = self._db["transactions"]
        item_list = []

        for doc in transaction_collection.find({"user_id": user_id}):
            temp_item_dict = {
                "_id": str(doc["_id"]),
                "user_id": doc["user_id"],
                "date": datetime.strptime(doc["date"], "%Y-%m-%d").strftime("%B %d"),
                "item": doc["item"],
                "price": f"${doc["price"]}",
                "category": doc["category"]
            }
            item_list.append(temp_item_dict)
        return item_list
        # return [{**doc, "_id": str(doc["_id"])} for doc in transaction_collection.find({"user_id": user_id})]

    def get_month_documents(self, user_id: str) -> list:
        transaction_collection = self._db["transactions"]
        item_list = []
        
        # Get current year and month in YYYY-MM format
        now = datetime.now()
        current_year_month = now.strftime("%Y-%m")
        current_year = now.year
        current_month = now.month
        
        # Use MongoDB query to filter by date prefix
        query = {
            "user_id": user_id,
            "date": {"$regex": f"^{current_year_month}-"}
        }
        
        for doc in transaction_collection.find(query):
            # Double-check the date is actually in the current month
            doc_date_str = doc.get("date", "")
            if not doc_date_str or not isinstance(doc_date_str, str):
                continue
                
            # Verify it starts with current year-month
            if doc_date_str.startswith(current_year_month):
                try:
                    # Parse the date to ensure it's valid and in current month
                    doc_date = datetime.strptime(doc_date_str, "%Y-%m-%d")
                    if doc_date.year == current_year and doc_date.month == current_month:
                        temp_item_dict = {
                            "_id": str(doc["_id"]),
                            "user_id": doc["user_id"],
                            "date": doc_date.strftime("%B %d"),
                            "item": doc["item"],
                            "price": f"${doc["price"]}",
                            "category": doc["category"]
                        }
                        item_list.append(temp_item_dict)
                except (ValueError, KeyError):
                    # Skip invalid date formats
                    continue
        return item_list
    
    def insert_user(self, user_id, form_data: ImmutableMultiDict) -> bool:
        users_collection = self._db["users"]

        username = form_data["username"]

        if users_collection.find_one({"username": username}):
            return False

        hashed = bcrypt.hashpw(form_data["password"].encode('utf-8'), bcrypt.gensalt())

        entry_document = {
            "user_id": user_id,
            "username": form_data["username"],
            "password": hashed.decode('utf-8')
        }

        users_collection.insert_one(entry_document)
        return True

    def search_user(self, form_data: ImmutableMultiDict) -> dict | bool:
        return_dict = {}
        username = form_data["username"]
        password = form_data["password"]

        
        users_collection = self._db["users"]
        print("HELLo")

        results = users_collection.find({"username": username})
        for entry in results:
            hashed_password_str = entry.get("password")
            user_id = entry.get("user_id")
            hashed_password = hashed_password_str.encode("utf-8")
            
            if bcrypt.checkpw(password.encode("utf-8"), hashed_password):
                return {
                    "user_id": user_id,
                    "username": username
                }
        return False
    
    def insert_budget(self, user_id: str, form_data: ImmutableMultiDict) -> None:
        budget_collection = self._db["budget"]

        category = form_data["category"]
        percent = form_data["percent"]

    
        entry_document = {
            "user_id": user_id,
            "category": form_data["category"],
            "percent": form_data["percent"],
        }

        budget_collection.replace_one(
            {
                "user_id": user_id,
                "category": category
            },
            entry_document,
            upsert=True
        )
    
    def delete_budget(self, user_id: str, category) -> None:
        budget_collection = self._db["budget"]
        budget_collection.delete_one({'category': category})
    

    def get_budget(self, user_id: str) -> list:
        budget_collection = self._db["budget"].find({"user_id": user_id})
        budget_list = []

        for doc in budget_collection:
            temp_budget_dict = {
                "_id": str(doc["_id"]),
                'user_id': doc["user_id"],
                "category": doc["category"],
                "percent": doc["percent"]
            }

            budget_list.append(temp_budget_dict)
        
        return budget_list
    
        


# DBM = DataBaseManager()
# DBM.get_total_spent("2177a0af-d1f2-484f-bd3b-4ab0dc3c0aff")





