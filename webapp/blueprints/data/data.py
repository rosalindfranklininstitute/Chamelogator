import json
from base64 import b64encode
from datetime import datetime

import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import jsonify, redirect, render_template, request, session, url_for

from . import blueprint


@blueprint.route('/data', methods=['GET', 'POST'])
def show_data(sessionid = 0):

    app.logger.info('-> data')

    # df_keys = json.loads(app.cham.df.to_json(orient='split'))["columns"]
    # df_vals = json.loads(app.cham.df.to_json(orient='split'))["data"]
    df = app.cham.to_json(orient='columns', date_format = 'iso')

    return render_template('/data/data.html.j2', sessionid=sessionid, cham_df=df)
