import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


# Setup blueprint route
@blueprint.route('/compare', methods=['GET', 'POST'])
def show_plots():

    app.logger.info('-> compare')

    # Render the compare template, passing along the dataframe json
    return render_template('/compare/compare.html.j2')
