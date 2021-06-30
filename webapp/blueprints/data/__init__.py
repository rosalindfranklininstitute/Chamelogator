from flask import Blueprint

blueprint = Blueprint('data', __name__)

from . import data