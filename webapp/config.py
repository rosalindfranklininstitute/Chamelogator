import os

#from Chamelogator.webapp.app import app

DEBUG = True

DB_NAME = 'RFI_chameleon.db'

SQLALCHEMY_DATABASE_URI = os.path.join('sqlite:////appuser/dbs', DB_NAME)
SQLALCHEMY_TRACK_MODIFICATIONS = False
