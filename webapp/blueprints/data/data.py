from base64 import b64encode
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, session, url_for, jsonify
from flask import current_app as app
import pandas as pd

from . import blueprint

@blueprint.route('/data/<sessionid>', methods=['GET', 'POST'])
def show_data(sessionid):

    app.logger.info('-> data')

    # any variable options selected with code?
    df = app.cham.df.to_dict()
    app.logger.error(df)

    return render_template('/data/data.html.j2', sessionid=sessionid, cham_df=df)