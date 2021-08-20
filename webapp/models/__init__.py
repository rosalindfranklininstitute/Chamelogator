from flask_sqlalchemy import SQLAlchemy
from webapp.app import app

db = SQLAlchemy(app)

from . import datadb
from .datadb import (Dispenses, Grids, Operations, Plunges, SampleDetails,
                     Sessions, Treatments)

# @app.cli.command('initdb')
# def initdb():
#     """Initialises the database.
#     """
#     db.drop_all()
#     db.create_all()
