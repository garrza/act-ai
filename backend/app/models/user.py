from bson import ObjectId
from flask import current_app
from config import mongo
from datetime import datetime

class User:
    @staticmethod
    def create(google_id, email, name):
        user = {"google_id": google_id, "email": email, "name": name}
        result = mongo.db.users.insert_one(user)
        return str(result.inserted_id)

    @staticmethod
    def get_by_google_id(google_id):
        return mongo.db.users.find_one({"google_id": google_id})

    @staticmethod
    def get_by_id(user_id):
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})


class Task:
    @staticmethod
    def create(user_id, email_text, task_description, result):
        task = {
            "user_id": user_id,
            "email_text": email_text,
            "task_description": task_description,
            "result": result,
            "created_at": datetime.utcnow(),
        }
        result = mongo.db.tasks.insert_one(task)
        return str(result.inserted_id)

    @staticmethod
    def get_by_user_id(user_id):
        return list(mongo.db.tasks.find({"user_id": user_id}))
