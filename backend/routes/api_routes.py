from flask import Blueprint
from controllers import email_controller, people_controller

api_routes = Blueprint("api_routes", __name__)

@api_routes.route("/read-emails", methods=["GET"])
def read_emails():
    return email_controller.read_emails()

@api_routes.route("/profile", methods=["GET"])
def fetch_metadata():
    return people_controller.fetch_metadata()
