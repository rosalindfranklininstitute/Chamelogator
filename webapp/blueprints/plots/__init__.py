from flask import Blueprint

blueprint = Blueprint('plots', __name__)

from . import plots