#import Flask
from flask import Flask, jsonify
import pymongo 
import json
import pandas as pd
from pymongo import MongoClient

#create app
app = Flask(__name__)

app.config['JSON_SORT_KEYS'] = False

#set up mongo atlas database connection
conn = "mongodb+srv://project3_group4:project3_group4@cluster0.a6d7ysg.mongodb.net/?retryWrites=true&w=majority"
# conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

#select db and collection to use
db = client.project3_data
collection = db.data

@app.route("/api/v1.0/project3/group4/data")
def group_data():
    """Return what we need to be json"""
    
    result_list = []
    results = collection.find()
    # print('abc')
    for result in results:
        del result['_id']
        result_list.append(result)
    real_list = {{"type": "FeatureCollection", "features": result_list}}
    return real_list

    
    
    



@app.route("/")
def welcome ():
    print("testest")
    return(
        f"Welcome to group 3's Flask API home page <br/>"
        f"Available Routes: <br/>"
        f"/api/v1.0/project3/group4/data"
    )

if __name__ == "__main__":
    app.run(debug=True)