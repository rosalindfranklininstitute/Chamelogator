from flask import Blueprint

blueprint = Blueprint('trends', __name__)

from . import trends