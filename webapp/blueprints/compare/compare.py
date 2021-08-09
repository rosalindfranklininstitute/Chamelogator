import base64
import io
import json
#from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
#import matplotlib.pyplot as plt
#import seaborn as sns
from datetime import datetime
from io import BytesIO

import pandas as pd
from flask import Blueprint
from flask import current_app as app
from flask import jsonify, redirect, render_template, request, session, url_for

from . import blueprint


@blueprint.route('/compare', methods=['GET', 'POST'])
def show_plots():

    # app.logger.info('-> plots')

    # df = app.cham.df.to_json()

    # img = BytesIO()
    # sns.set_style("dark") #E.G.

    # y = [1,2,3,4,5]
    # x = [0,2,1,3,4]

    # plt.plot(x,y)
    # plt.savefig(img, format='png')
    # plt.close()
    # img.seek(0)

    # plot_url = base64.b64encode(img.getvalue()).decode()
    
    df = app.cham.to_json(orient='columns', date_format = 'iso')

    return render_template('/compare/compare.html.j2', cham_df=df)
