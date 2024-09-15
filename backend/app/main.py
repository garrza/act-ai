from flask import Flask
from config import init_app, mongo
from models.user import User, Task


def create_app():
    app = Flask(__name__)
    init_app(app)
    return app


app = create_app()


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.json
    google_token = data.get("token")

    # Verify the Google token (you'll need to implement this)
    user_info = verify_google_token(google_token)

    if not user_info:
        return jsonify({"error": "Invalid token"}), 400

    user = User.get_by_google_id(user_info["sub"])
    if not user:
        user_id = User.create(user_info["sub"], user_info["email"], user_info["name"])
    else:
        user_id = str(user["_id"])

    return jsonify({"user_id": user_id, "name": user["name"], "email": user["email"]})


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


if __name__ == "__main__":
    app.run(debug=True)
