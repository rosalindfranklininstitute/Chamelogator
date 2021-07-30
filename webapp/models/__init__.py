from flask_sqlalchemy import SQLAlchemy

from Chamelogator.webapp.app import app

db = SQLAlchemy(app)

from . import datadb

from .datadb import Sessions, SampleDetails, Operations, Plunges, Treatments, Dispenses, Grids

# @app.cli.command('initdb')
# def initdb():
#     """Initialises the database.
#     """
#     db.drop_all()
#     db.create_all()