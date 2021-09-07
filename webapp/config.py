import os

DEBUG = True

DBS = [f for f in os.listdir('/appuser/dbs') if f.endswith(".db")]
DB_NAME = 'MIT_chameleon.db'

UPLOAD_FOLDER = '/app/webapp/data'

SQLALCHEMY_DATABASE_URI = os.path.join('sqlite:////appuser/dbs', DB_NAME)
SQLALCHEMY_TRACK_MODIFICATIONS = False
