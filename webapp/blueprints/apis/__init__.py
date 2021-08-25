from flask import Blueprint, blueprints

blueprint = Blueprint('apis', __name__)

from . import fetch_df
