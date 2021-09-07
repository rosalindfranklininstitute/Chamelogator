import csv
import io
import json
import os

from flask import current_app as app
from flask import flash, redirect, request, url_for
from werkzeug.utils import secure_filename

from . import blueprint

ALLOWED_EXTENSIONS = {'txt', 'csv'}


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@blueprint.route('/apis/upload', methods=['GET', 'POST'])
def upload_file():

    app.logger.info('--> upload file')

    if request.method == 'POST':
        # check if the post request has the file part
        if 'datafile' not in request.files:
            #flash('No file part')
            app.logger.warning('No file part')
            return redirect(request.url)
        file = request.files['datafile']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            #flash('No selected file')
            app.logger.warning('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            app.logger.info('File accepted')

            filename = secure_filename(file.filename)
            # file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            data = file.read()

            axes, data = data.decode('utf-8').split('\n', 1)

            axes = axes.split(',')

            reader = csv.DictReader(io.StringIO(data))
            json_data = json.dumps(list(reader))

            return {'axes': axes, 'data': json_data}
        else:
            app.logger.info('Not accepted file')
            return redirect(request.url)
