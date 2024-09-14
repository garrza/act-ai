from flask import Flask
from routes.api_routes import api_routes
from config import init_db

app = Flask(__name__)

# Initialize the database
init_db()

# Debug print to check type
print(type(api_routes))

# Register the blueprint
app.register_blueprint(api_routes, url_prefix="/api")

if __name__ == '__main__':
    app.run()
