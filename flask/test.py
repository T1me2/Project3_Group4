#import Flask
from flask import Flask, jsonify
import pymongo 
import json
import pandas as pd
from pymongo import MongoClient

#create app
app = Flask(__name__)

#set up mongo atlas database connection
conn = "mongodb+srv://project3_group4:project3_group4@cluster0.a6d7ysg.mongodb.net/?retryWrites=true&w=majority"
# conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

#select db and collection to use
db = client.project3_group4
collection = db.data

# result_list = []

#create routes
@app.route("/api/v1.0/project3/group4/data", methods=['GET'])
def group_data():
    """Return what we need to be json"""
    result_list = []
    results = collection.find()
    for result in results:
        result_list.append(result)
    
    return jsonify(result_list)
    
    



@app.route("/")
def welcome ():
    return(
        f"Welcome to group 3's Flask API home page <br/>"
        f"Available Routes: <br/>"
        f"/api/v1.0/project3/group4/data"
    )

if __name__ == "__main__":
    app.run(debug=True)