import os

from Chamelogator.webapp.app import app

DEBUG = True

SQLALCHEMY_DATABASE_URI = 'sqlite:////' + os.path.join(app.root_path, 'data/chameleon.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False
