import os
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv
from models.user import User, Task
from core.agent import WebAgent
from core.task_handler import TaskHandler
from ai.task_recognition import TaskRecognition
from lavague.core import WorldModel, ActionEngine
from lavague.contexts.openai import OpenaiContext
from lavague.drivers.selenium import SeleniumDriver as LavagueSeleniumDriver
from config import init_app, mongo
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

# init db
init_app(app)

# init components
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

context = OpenaiContext(api_key=api_key)
selenium_driver = LavagueSeleniumDriver(headless=True)
task_recognition = TaskRecognition(api_key=api_key)
world_model = WorldModel.from_context(context)
action_engine = ActionEngine.from_context(context, selenium_driver)
agent = WebAgent(world_model, action_engine)
task_handler = TaskHandler(agent, task_recognition)


@app.route("/api/process_task", methods=["POST"])
def process_task():
    data = request.json
    email_text = data.get("email_text")
    user_id = data.get("user_id")

    print(f"Received task for user: {user_id}")

    if not email_text or not user_id:
        return jsonify({"error": "Email text and user ID are required"}), 400

    user = User.get_by_google_id(user_id)
    if not user:
        print(f"User not found for ID: {user_id}. Creating new user.")
        # Create a new user with minimal information
        User.create(user_id, "", "")
        user = User.get_by_google_id(user_id)
        if not user:
            return jsonify({"error": "Failed to create user"}), 500

    try:
        result = task_handler.execute_task(email_text, user_id)
        return jsonify({"result": result})
    except Exception as e:
        print(f"Error processing task: {str(e)}")
        return jsonify({"error": "An error occurred while processing the task"}), 500


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.json
    google_token = data.get("token")

    if not google_token:
        return jsonify({"error": "Token is required"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            google_token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )

        user_info = {
            "sub": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo["name"],
        }

        user = User.get_by_google_id(user_info["sub"])
        if not user:
            user_id = User.create(
                user_info["sub"], user_info["email"], user_info["name"]
            )
        else:
            user_id = user_info["sub"]

        return jsonify(
            {"user_id": user_id, "name": user_info["name"], "email": user_info["email"]}
        )

    except ValueError:
        return jsonify({"error": "Invalid token"}), 401


if __name__ == "__main__":
    app.run(debug=True)
