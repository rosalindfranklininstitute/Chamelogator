import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import render_template, url_for

from . import blueprint


@blueprint.route('/trends', methods=['GET', 'POST'])
def show_trends():
    """Function that tells flask to render the trends page template when
    navigating to the /trends URL of the webapp.

    Returns:
        template: A rendered Jinja2 HTML template
    """

    app.logger.info('-> trends')

    return render_template('/trends/trends.html.j2')
