import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


# Set up blueprint route
@blueprint.route('/trends', methods=['GET', 'POST'])
def show_trends():

    app.logger.info('-> trends')

    # Render the trends template
    return render_template('/trends/trends.html.j2')
