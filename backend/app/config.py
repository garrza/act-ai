import os
from flask_pymongo import PyMongo


class Config:
    MONGO_URI = "mongodb+srv://mongoDB:mongoDB@act.k9pey.mongodb.net/"
    DB_NAME = "ActDB"
    COLLECTION_NAME = "context"


mongo = PyMongo()


def init_app(app):
    app.config.from_object(Config)
    mongo.init_app(app)
