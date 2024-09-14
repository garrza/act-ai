from flask import Flask
from routes import api_routes
from config import init_db

app = Flask(__name__)

# Initialize database
init_db()

# Register API routes
app.register_blueprint(api_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
