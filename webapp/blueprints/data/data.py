import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


# Setup blueprint route
@blueprint.route('/data', methods=['GET', 'POST'])
def show_data():

    app.logger.info('-> data')

    # Convert the dataframe into json format for javascript to understand
    # Also make sure the datetimes are in ISO format instead of epoch ms
    df = app.cham.to_json(orient='columns', date_format='iso')

    # Render the compare template, passing along the dataframe json
    return render_template('/data/data.html.j2', cham_df=df)
