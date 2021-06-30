import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template, url_for, g, request, redirect, session, flash

# Setup the app
app = Flask(__name__)
#app.config.from_object(obj)

handler = RotatingFileHandler('flask_log.log', maxBytes=100000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

app.jinja_env.add_extension('jinja2.ext.loopcontrols')

# import other parts of the app
# (Must be done after creating app due to circular imports)
from blueprints.plots import plots
from blueprints.data import data

@app.route("/", methods=['GET', 'POST'])
def index():

    return render_template('index.html.j2')

app.register_blueprint(plots.blueprint)
app.register_blueprint(data.blueprint)