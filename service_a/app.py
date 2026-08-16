from flask import Flask, jsonify, request
from pymongo import MongoClient
import os

app = Flask(__name__)

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017/servicea_db")
client = MongoClient(mongo_url)
db = client.get_default_database()
collection = db["messages"]

@app.route("/greet")
def greet():
    return jsonify({"message": "Hello from Service A"})

@app.route("/save", methods=["POST"])
def save():
    data = request.get_json()
    result = collection.insert_one(data)
    return jsonify({"status": "saved", "id": str(result.inserted_id)})

@app.route("/all")
def get_all():
    docs = list(collection.find({}, {"_id": 0}))
    return jsonify(docs)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
    
    