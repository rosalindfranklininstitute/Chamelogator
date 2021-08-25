import os

#from Chamelogator.webapp.app import app

DEBUG = True

DB_NAME = 'chameleon.db'

SQLALCHEMY_DATABASE_URI = os.path.join('sqlite:////appuser/data', DB_NAME)
SQLALCHEMY_TRACK_MODIFICATIONS = False
