#import Flask
from flask import Flask, jsonify

# Dictionary of Justice League (using class example to setup on render)

justice_league_members = [
    {"superhero": "Aquaman", "real_name": "Arthur Curry"},
    {"superhero": "Batman", "real_name": "Bruce Wayne"},
    {"superhero": "Cyborg", "real_name": "Victor Stone"},
    {"superhero": "Flash", "real_name": "Barry Allen"},
    {"superhero": "Green Lantern", "real_name": "Hal Jordan"},
    {"superhero": "Superman", "real_name": "Clark Kent/Kal-El"},
    {"superhero": "Wonder Woman", "real_name": "Princess Diana"}
]

#create app
app = Flask(__name__)

#create routes
@app.route("/api/v1.0/project3/group4/data")
def group_data():
    """Return what we need to be json"""

    return jsonify(justice_league_members)

@app.route("/")
def welcome ():
    return(
        f"Welcome to group 3's Flask API home page <br/>"
        f"Available Routes: <br/>"
        f"/api/v1.0/project3/group4/data"
    )

if __name__ == "__main__":
    app.run(debug=True)