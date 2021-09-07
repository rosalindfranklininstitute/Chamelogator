import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask, render_template

# Setup the app
app = Flask(__name__, root_path=os.path.abspath(os.path.dirname(__file__)))
app.config.from_pyfile("config.py")

# Set up logging
handler = RotatingFileHandler("flask_log.log", maxBytes=100000, backupCount=1)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

app.jinja_env.add_extension("jinja2.ext.loopcontrols")

# import other parts of the app
# (Must be done after creating app due to circular imports)
from .blueprints import apis, compare, data, trends


# Set up route to index page
@app.route("/", methods=["GET", "POST"])
def index():
    """Function that tells flask to render the index page template when
    navigating to the base URL of the webapp.

    Returns:
        template: A rendered Jinja2 HTML template
    """

    # Render the index template
    return render_template("index.html.j2")


# Register blueprints for other pages on webapp
app.register_blueprint(data.blueprint)
app.register_blueprint(compare.blueprint)
app.register_blueprint(trends.blueprint)
app.register_blueprint(apis.blueprint)
