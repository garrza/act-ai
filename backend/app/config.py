import os
from flask_pymongo import PyMongo


mongo = PyMongo()


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://mongoDB:mongoDB@act.k9pey.mongodb.net/ActDB")

    DB_NAME = os.getenv("DB_NAME", "ActDB")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "context")


def init_app(app):
    app.config.from_object(Config)
    mongo.init_app(app)
