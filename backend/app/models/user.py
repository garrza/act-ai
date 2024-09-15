from bson import ObjectId
from flask import current_app
from config import mongo
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class User:
    @staticmethod
    def create(google_id, email, name):
        try:
            user = {"google_id": google_id, "email": email, "name": name}
            result = mongo.db.users.insert_one(user)
            logger.info(f"User created with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None

    @staticmethod
    def get_by_google_id(google_id):
        try:
            user = mongo.db.users.find_one({"google_id": google_id})
            if user:
                logger.info(f"User found with Google ID: {google_id}")
            else:
                logger.info(f"No user found with Google ID: {google_id}")
            return user
        except Exception as e:
            logger.error(f"Error getting user by Google ID: {e}")
            return None

    @staticmethod
    def get_by_id(user_id):
        try:
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                logger.info(f"User found with ID: {user_id}")
            else:
                logger.info(f"No user found with ID: {user_id}")
            return user
        except Exception as e:
            logger.error(f"Error getting user by ID: {e}")
            return None


class Task:
    @staticmethod
    def create(user_id, email_text, task_description, result):
        try:
            task = {
                "user_id": user_id,
                "email_text": email_text,
                "task_description": task_description,
                "result": result,
                "created_at": datetime.utcnow(),
            }
            result = mongo.db.tasks.insert_one(task)
            logger.info(f"Task created with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            return None

    @staticmethod
    def get_by_user_id(user_id):
        try:
            tasks = list(mongo.db.tasks.find({"user_id": user_id}))
            logger.info(f"Found {len(tasks)} tasks for user ID: {user_id}")
            return tasks
        except Exception as e:
            logger.error(f"Error getting tasks by user ID: {e}")
            return []