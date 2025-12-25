from datetime import date, datetime
from pymongo import ASCENDING, DESCENDING
from pymongo.database import Database as MongoDatabase
from decimal import Decimal


class StatsManager():
    def __init__(self, db: MongoDatabase):
        self._db = db

    def _get_transactions(self, user_id: str, view: str = "all"):
        """Helper method to get transactions filtered by view type"""
        query = {"user_id": user_id}
        
        if view == "monthly":
            # Filter for current month - more precise regex
            now = datetime.now()
            current_year_month = now.strftime("%Y-%m")
            current_year = now.year
            current_month = now.month
            # Use regex to match dates that start with current year-month followed by a dash
            query["date"] = {"$regex": f"^{current_year_month}-"}
        else:
            current_year = None
            current_month = None
        
        # Get all matching transactions
        all_transactions = list(self._db["transactions"].find(query))
        
        if view == "monthly":
            # Double-check each transaction is in the current month (extra safety)
            filtered_transactions = []
            for tx in all_transactions:
                tx_date = tx.get("date", "")
                # Ensure the date string starts with the current year-month
                if isinstance(tx_date, str) and tx_date.startswith(current_year_month):
                    try:
                        # Parse and verify the date is actually in current month
                        tx_date_parsed = datetime.strptime(tx_date, "%Y-%m-%d")
                        if tx_date_parsed.year == current_year and tx_date_parsed.month == current_month:
                            filtered_transactions.append(tx)
                    except (ValueError, KeyError):
                        # Skip invalid date formats
                        continue
            return filtered_transactions
        
        return all_transactions

    def total_price(self, user_id: str, view: str = "all") -> str:
        transaction_collection = self._get_transactions(user_id, view)
        total = sum(Decimal(tx["price"]) for tx in transaction_collection)
        return f"{float(total):.2f}"
    
    def get_percent_per_category(self, user_id: str, view: str = "all") -> dict:
        category_dict = {}
        total_spending = float(self.total_price(user_id, view))

        if total_spending == 0:
            return {}

        transaction_collection = self._get_transactions(user_id, view)

        for entry in transaction_collection:
            category = entry["category"]
            price = float(entry["price"])
            category_dict[category] = category_dict.get(category, 0) + price

        return {
            category: f"{(amount / total_spending) * 100:.2f}%"
            for category, amount in category_dict.items()
        }
    
    def get_price_per_category(self, user_id: str, view: str = "all") -> dict:
        category_dict = {}
        
        transaction_collection = self._get_transactions(user_id, view)

        for entry in transaction_collection:
            category = entry["category"]
            price = float(entry["price"])
            category_dict[category] = category_dict.get(category, 0) + price

        return {
            category: f"${amount:.2f}"
            for category, amount in category_dict.items()
        }

    

# SM = StatsManager(DBM.db())
# USER_ID= "2177a0af-d1f2-484f-bd3b-4ab0dc3c0aff"
# print(SM.get_percent_per_category(USER_ID))
# print(SM.total_price(USER_ID))