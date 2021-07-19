import io
import base64
from io import BytesIO
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, session, url_for, jsonify
from flask import current_app as app

from . import blueprint

@blueprint.route('/plots', methods=['GET', 'POST'])
def show_plots():

    app.logger.info('-> plots')

    df = app.cham.df.to_json()

    img = BytesIO()
    sns.set_style("dark") #E.G.

    y = [1,2,3,4,5]
    x = [0,2,1,3,4]

    plt.plot(x,y)
    plt.savefig(img, format='png')
    plt.close()
    img.seek(0)

    plot_url = base64.b64encode(img.getvalue()).decode()

    return render_template('/plots/plots.html.j2', cham_df=df, plot_url=plot_url)