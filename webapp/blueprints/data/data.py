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

    # any variable options selected with code?
    df = app.cham.df.to_json()
    #app.logger.error(df)

    return render_template('/data/data.html.j2', sessionid=sessionid, cham_df=df)


# @app.route('/_get_table')
# def get_table():
#     cols = request.args.get('cols', type=int)
#     rows = request.args.get('rows', type=int)

#     df = pd.DataFrame(np.random.randint(0, 100, size=(a, b)))

#     return jsonify(number_elements=a * b,
#                    my_table=json.loads(df.to_json(orient="split"))["data"],
#                    columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])