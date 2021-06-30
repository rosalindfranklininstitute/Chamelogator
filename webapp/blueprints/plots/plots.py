from base64 import b64encode
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, session, url_for, jsonify
from flask import current_app as app

from . import blueprint

@blueprint.route('/plots', methods=['GET', 'POST'])
def show_plots():

    app.logger.info('-> plots')

    # any variable options selected with code?

    return render_template('/plots/plots.html.j2')