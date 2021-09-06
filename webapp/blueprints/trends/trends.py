import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


@blueprint.route('/trends', methods=['GET', 'POST'])
def show_trends():

    app.logger.info('-> trends')

    return render_template('/trends/trends.html.j2')
