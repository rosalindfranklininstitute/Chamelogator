import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template, url_for, g, request, redirect, session, flash

# Setup the app
app = Flask(__name__, root_path=os.path.abspath(os.path.dirname(__file__)))
app.config.from_pyfile('config.py')

handler = RotatingFileHandler('flask_log.log', maxBytes=100000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

app.jinja_env.add_extension('jinja2.ext.loopcontrols')

# import other parts of the app
# (Must be done after creating app due to circular imports)
from . import models

from .blueprints.plots import plots
from .blueprints.data import data
from .models.datadb import Sessions, SampleDetails, Operations, Plunges, Treatments, Dispenses, Grids

from Chamelogator.scripts import chamelogator

cham = chamelogator.Chamelogator()
cham.fetch_df()

app.cham = cham

@app.route("/", methods=['GET', 'POST'])
def index():

    return render_template('index.html.j2')

app.register_blueprint(plots.blueprint)
app.register_blueprint(data.blueprint)