import os
from flask import Flask, request, jsonify
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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database
init_app(app)

# Initialize components
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

    user = User.get_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    result = task_handler.execute_task(email_text, user_id)
    return jsonify({"result": result})


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.json
    google_token = data.get("token")

    # For testing, accept any non-empty string as a valid token
    if not google_token:
        return jsonify({"error": "Token is required"}), 400

    user_info = {
        "sub": google_token,
        "email": f"{google_token}@example.com",
        "name": f"Test User {google_token}",
    }

    user = User.get_by_google_id(user_info["sub"])
    if not user:
        user_id = User.create(user_info["sub"], user_info["email"], user_info["name"])
    else:
        user_id = str(user["_id"])

    return jsonify(
        {"user_id": user_id, "name": user_info["name"], "email": user_info["email"]}
    )


if __name__ == "__main__":
    app.run(debug=True)
