from base64 import b64encode
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, session, url_for, jsonify
from flask import current_app as app
import pandas as pd
import json

from . import blueprint

@blueprint.route('/data', methods=['GET', 'POST'])
def show_data(sessionid = 0):

    app.logger.info('-> data')

    # df_keys = json.loads(app.cham.df.to_json(orient='split'))["columns"]
    # df_vals = json.loads(app.cham.df.to_json(orient='split'))["data"]
    df = app.cham.df.to_json()

    return render_template('/data/data.html.j2', sessionid=sessionid, cham_df=df)