import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


# Setup blueprint route
@blueprint.route('/data', methods=['GET', 'POST'])
def show_data():

    app.logger.info('-> data')

    # Render the compare template
    return render_template('/data/data.html.j2')
