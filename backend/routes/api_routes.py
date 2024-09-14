from flask import Blueprint, request, jsonify
from controllers import email_controller, task_controller, action_controller

api_routes = Blueprint("api_routes", __name__)


@api_routes.route("/read-emails", methods=["GET"])
def read_emails():
    return email_controller.read_emails()


@api_routes.route("/summarize-tasks", methods=["POST"])
def summarize_tasks():
    email_data = request.json
    return task_controller.summarize_tasks(email_data)


@api_routes.route("/perform-task", methods=["POST"])
def perform_task():
    task_data = request.json
    return action_controller.perform_task(task_data)
