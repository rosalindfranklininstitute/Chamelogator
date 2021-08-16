import logging
import os
from logging.handlers import RotatingFileHandler

import pandas as pd
from flask import Flask, render_template, url_for

# Setup the app
app = Flask(__name__, root_path=os.path.abspath(os.path.dirname(__file__)))
app.config.from_pyfile("config.py")

# Set up logging
handler = RotatingFileHandler("flask_log.log", maxBytes=100000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

app.jinja_env.add_extension("jinja2.ext.loopcontrols")

# import other parts of the app
# (Must be done after creating app due to circular imports)
from . import models
from .blueprints.compare import compare
from .blueprints.data import data
from .blueprints.trends import trends
from .models.datadb import (AcceptedGrids, Dispenses, GlowDischarges, Grids,
                            Operations, Plunges, RejectedGrids, SampleDetails,
                            Sessions, Treatments, db)

# Fetch the bind to be used for queries
bind = db.session.bind

# Set up queries for each table
sessions_query = db.session.query(Sessions)
sample_query = db.session.query(SampleDetails)
operations_query = db.session.query(Operations)
plunges_query = db.session.query(Plunges)
treatments_query = db.session.query(Treatments)
dispenses_query = db.session.query(Dispenses)
grids_query = db.session.query(Grids)
accepted_grids_query = db.session.query(AcceptedGrids)
rejected_grids_query = db.session.query(RejectedGrids)
glow_discharges_query = db.session.query(GlowDischarges)

# Use the statements of the queries to
sessions = pd.read_sql_query(sessions_query.statement, bind)
samples = pd.read_sql_query(sample_query.statement, bind)
operations = pd.read_sql_query(operations_query.statement, bind)
plunges = pd.read_sql_query(plunges_query.statement, bind)
treatments = pd.read_sql_query(treatments_query.statement, bind)
dispenses = pd.read_sql_query(dispenses_query.statement, bind)
grids = pd.read_sql_query(grids_query.statement, bind)
accepted_grids = pd.read_sql_query(accepted_grids_query.statement, bind)
rejected_grids = pd.read_sql_query(rejected_grids_query.statement, bind)
glow_discharges = pd.read_sql_query(glow_discharges_query.statement, bind)


# Merge the dataframes together using the common keys
a = pd.merge(
    sessions,
    samples,
    "outer",
    left_on="ROWID",
    right_on="SessionId",
)
b = pd.merge(
    a, operations, "outer", left_on="ROWID", right_on="SampleDetailsId"
)  # SessionId and SampleDetailsId are the same!!!!
c = pd.merge(b, grids, "outer", left_on="GridId", right_on="ROWID")
d = pd.merge(c, plunges, "outer", left_on="ROWID_y", right_on="OperationId")
e = pd.merge(d, treatments, "outer", left_on="GridId", right_on="GridId")
f = pd.merge(e, dispenses, "outer", left_on="ROWID_y", right_on="OperationId")
g = pd.merge(f, accepted_grids, "left", left_on="AcceptedId", right_on="ROWID", suffixes=("_acceptedx", "_acceptedy"))
h = pd.merge(g, rejected_grids, "left", left_on="RejectedId", right_on="ROWID", suffixes=("_rejectedx", "_rejectedy"))
j = pd.merge(h, glow_discharges, "outer", left_on="GlowDischargeId", right_on="ROWID", suffixes=("_glowx", "_glowy"))

df = j

# Declare and remove duplicate columns, and renaming the remaining ones to
# more useful names
labels = ["SessionId", "OperationId_x", "OperationId_y", "ROWID_acceptedx", "ROWID_acceptedy", "ROWID_glowx", "GlowDischargeId"]
app.logger.info(f"dropping: {labels}")
df.drop(labels, axis=1, inplace=True)
df.rename(
    columns={
        "ROWID_x": "SessionId",
        "ROWID_y": "OperationId",
        "DateTimeUTC_x": "SessionTime",
        "DateTimeUTC_y": "OperationTime",
        "Notes_x": "SampleNotes",
        "Notes_y": "GridNotes",
        "Evaluation_rejectedx": "AcceptedEvaluation",
        "Evaluation_rejectedy": "RejectedEvaluation",
        "Comments_rejectedx": "AcceptedComments",
        "Comments_rejectedy": "RejectedComments",
        "ROWID_glowy": "GlowDischargeId"
    },
    inplace=True,
)

# Sort the new massive dataframe be ascending Session IDs
df.sort_values(by=["SessionId"], ascending=True, inplace=True)
# If there isn't a value in the SessionId column, it probably is junk
df.dropna(subset=["SessionId"], inplace=True)

# Store df in app namespace for easy access by rest of app
# (should I do this?)
app.cham = df

# Set up route to index page
@app.route("/", methods=["GET", "POST"])
def index():

    # Render the index template
    return render_template("index.html.j2")


# Register blueprints for other pages on webapp
app.register_blueprint(data.blueprint)
app.register_blueprint(compare.blueprint)
app.register_blueprint(trends.blueprint)
