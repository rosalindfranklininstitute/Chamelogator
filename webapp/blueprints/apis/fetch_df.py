import pandas as pd
import requests
from flask import Blueprint, Response
from flask import current_app as app
from flask import flash, render_template, url_for

from ...models.datadb import (AcceptedGrids, Dispenses, GlowDischarges, Grids,
                              Operations, Plunges, RejectedGrids,
                              SampleDetails, Sessions, Treatments, db)
from . import blueprint


@blueprint.route('/apis/fetch_df', methods=['GET', 'POST'])
def fetch_df():

    try:
        # Fetch the bind to be used for queries
        bind = db.session.bind

        # Set up queries for each table
        sessions_query = db.session.query(Sessions)
        sample_query = db.session.query(SampleDetails)
        operations_query = db.session.query(Operations)
        plunges_query = db.session.query(Plunges)
        treatments_query = db.session.query(Treatments)
        dispenses_query = db.session.query(Dispenses)
        grids_query = db.session.query(Grids)
        accepted_grids_query = db.session.query(AcceptedGrids)
        rejected_grids_query = db.session.query(RejectedGrids)
        glow_discharges_query = db.session.query(GlowDischarges)

        # Use the statements of the queries to
        sessions = pd.read_sql_query(sessions_query.statement, bind)
        samples = pd.read_sql_query(sample_query.statement, bind)
        operations = pd.read_sql_query(operations_query.statement, bind)
        plunges = pd.read_sql_query(plunges_query.statement, bind)
        treatments = pd.read_sql_query(treatments_query.statement, bind)
        dispenses = pd.read_sql_query(dispenses_query.statement, bind)
        grids = pd.read_sql_query(grids_query.statement, bind)
        accepted_grids = pd.read_sql_query(
            accepted_grids_query.statement, bind)
        rejected_grids = pd.read_sql_query(
            rejected_grids_query.statement, bind)
        glow_discharges = pd.read_sql_query(
            glow_discharges_query.statement, bind)

        # Merge the dataframes together using the common keys
        a = pd.merge(
            sessions,
            samples,
            "outer",
            left_on="ROWID",
            right_on="SessionId",
        )
        b = pd.merge(
            a, operations, "outer", left_on="ROWID", right_on="SampleDetailsId"
        )  # SessionId and SampleDetailsId are the same!!!!
        c = pd.merge(b, grids, "outer", left_on="GridId", right_on="ROWID")
        d = pd.merge(c, plunges, "outer", left_on="ROWID_y",
                     right_on="OperationId")
        e = pd.merge(d, treatments, "outer",
                     left_on="GridId", right_on="GridId")
        f = pd.merge(e, dispenses, "outer", left_on="ROWID_y",
                     right_on="OperationId")
        g = pd.merge(f, accepted_grids, "left", left_on="AcceptedId",
                     right_on="ROWID", suffixes=("_acceptedx", "_acceptedy"))
        h = pd.merge(g, rejected_grids, "left", left_on="RejectedId",
                     right_on="ROWID", suffixes=("_rejectedx", "_rejectedy"))
        j = pd.merge(h, glow_discharges, "outer", left_on="GlowDischargeId",
                     right_on="ROWID", suffixes=("_glowx", "_glowy"))

        df = j

        # Declare and remove duplicate columns, and renaming the remaining ones to
        # more useful names
        labels = ["SessionId", "OperationId_x", "OperationId_y",
                  "ROWID_acceptedx", "ROWID_acceptedy", "ROWID_glowx", "GlowDischargeId"]
        app.logger.info(f"dropping: {labels}")
        df.drop(labels, axis=1, inplace=True)
        df.rename(
            columns={
                "ROWID_x": "SessionId",
                "ROWID_y": "OperationId",
                "DateTimeUTC_x": "SessionTime",
                "DateTimeUTC_y": "OperationTime",
                "Notes_x": "SampleNotes",
                "Notes_y": "GridNotes",
                "Evaluation_rejectedx": "AcceptedEvaluation",
                "Evaluation_rejectedy": "RejectedEvaluation",
                "Comments_rejectedx": "AcceptedComments",
                "Comments_rejectedy": "RejectedComments",
                "ROWID_glowy": "GlowDischargeId"
            },
            inplace=True,
        )

        # Sort the new massive dataframe be ascending Session IDs
        df.sort_values(by=["SessionId"], ascending=True, inplace=True)
        # If there isn't a value in the SessionId column, it probably is junk
        df.dropna(subset=["SessionId"], inplace=True)

        # Convert the dataframe into json format for javascript to understand
        # Also make sure the datetimes are in ISO format instead of epoch ms
        return df.to_json(orient='columns', date_format='iso')

    except requests.exceptions.Timeout as e:
        app.logger.info(e)

        #flash('There was a timeout error with this request', 'danger')
        return Response("There was a timeout error with this request", status=408)

    except requests.exceptions.ConnectionError as e:
        app.logger.info(e)

        #flash('There was a connection error with this request', 'danger')
        return Response("There was a connection error with this request", status=500)

    except requests.exceptions.HTTPError as e:
        app.logger.info("HTTP error")

        #flash('There was a http error with this request', 'danger')
        return Response("There was a http error with this request", status=500)

    except requests.exceptions.TooManyRedirects as e:
        app.logger.info(e)

        #flash('There was a too many redirects error with this request', 'danger')
        return Response("There was a too many redirects error with this request", status=500)

    except requests.exceptions.RequestException as e:
        app.logger.info(e)

        #flash('There was an error with this request', 'danger')
        return Response("There was an error with this request", status=500)


@blueprint.route('/apis/fetch_df_headers', methods=['GET', 'POST'])
def fetch_df_headers():

    try:
        # Fetch the bind to be used for queries
        bind = db.session.bind

        # Set up queries for each table
        sessions_query = db.session.query(Sessions)
        sample_query = db.session.query(SampleDetails)
        operations_query = db.session.query(Operations)
        plunges_query = db.session.query(Plunges)
        treatments_query = db.session.query(Treatments)
        dispenses_query = db.session.query(Dispenses)
        grids_query = db.session.query(Grids)
        accepted_grids_query = db.session.query(AcceptedGrids)
        rejected_grids_query = db.session.query(RejectedGrids)
        glow_discharges_query = db.session.query(GlowDischarges)

        # Use the statements of the queries to
        sessions = pd.read_sql_query(sessions_query.statement, bind)
        samples = pd.read_sql_query(sample_query.statement, bind)
        operations = pd.read_sql_query(operations_query.statement, bind)
        plunges = pd.read_sql_query(plunges_query.statement, bind)
        treatments = pd.read_sql_query(treatments_query.statement, bind)
        dispenses = pd.read_sql_query(dispenses_query.statement, bind)
        grids = pd.read_sql_query(grids_query.statement, bind)
        accepted_grids = pd.read_sql_query(
            accepted_grids_query.statement, bind)
        rejected_grids = pd.read_sql_query(
            rejected_grids_query.statement, bind)
        glow_discharges = pd.read_sql_query(
            glow_discharges_query.statement, bind)

        # Merge the dataframes together using the common keys
        a = pd.merge(
            sessions,
            samples,
            "outer",
            left_on="ROWID",
            right_on="SessionId",
        )
        b = pd.merge(
            a, operations, "outer", left_on="ROWID", right_on="SampleDetailsId"
        )  # SessionId and SampleDetailsId are the same!!!!
        c = pd.merge(b, grids, "outer", left_on="GridId", right_on="ROWID")
        d = pd.merge(c, plunges, "outer", left_on="ROWID_y",
                     right_on="OperationId")
        e = pd.merge(d, treatments, "outer",
                     left_on="GridId", right_on="GridId")
        f = pd.merge(e, dispenses, "outer", left_on="ROWID_y",
                     right_on="OperationId")
        g = pd.merge(f, accepted_grids, "left", left_on="AcceptedId",
                     right_on="ROWID", suffixes=("_acceptedx", "_acceptedy"))
        h = pd.merge(g, rejected_grids, "left", left_on="RejectedId",
                     right_on="ROWID", suffixes=("_rejectedx", "_rejectedy"))
        j = pd.merge(h, glow_discharges, "outer", left_on="GlowDischargeId",
                     right_on="ROWID", suffixes=("_glowx", "_glowy"))

        df = j

        # Declare and remove duplicate columns, and renaming the remaining ones to
        # more useful names
        labels = ["SessionId", "OperationId_x", "OperationId_y",
                  "ROWID_acceptedx", "ROWID_acceptedy", "ROWID_glowx", "GlowDischargeId"]
        app.logger.info(f"dropping: {labels}")
        df.drop(labels, axis=1, inplace=True)
        df.rename(
            columns={
                "ROWID_x": "SessionId",
                "ROWID_y": "OperationId",
                "DateTimeUTC_x": "SessionTime",
                "DateTimeUTC_y": "OperationTime",
                "Notes_x": "SampleNotes",
                "Notes_y": "GridNotes",
                "Evaluation_rejectedx": "AcceptedEvaluation",
                "Evaluation_rejectedy": "RejectedEvaluation",
                "Comments_rejectedx": "AcceptedComments",
                "Comments_rejectedy": "RejectedComments",
                "ROWID_glowy": "GlowDischargeId"
            },
            inplace=True,
        )

        # Sort the new massive dataframe be ascending Session IDs
        df.sort_values(by=["SessionId"], ascending=True, inplace=True)
        # If there isn't a value in the SessionId column, it probably is junk
        df.dropna(subset=["SessionId"], inplace=True)

        # Convert the dataframe into json format for javascript to understand
        # Also make sure the datetimes are in ISO format instead of epoch ms
        return df.to_json(orient='columns', date_format='iso')

    except requests.exceptions.Timeout as e:
        app.logger.info(e)

        #flash('There was a timeout error with this request', 'danger')
        return Response("There was a timeout error with this request", status=408)

    except requests.exceptions.ConnectionError as e:
        app.logger.info(e)

        #flash('There was a connection error with this request', 'danger')
        return Response("There was a connection error with this request", status=500)

    except requests.exceptions.HTTPError as e:
        app.logger.info("HTTP error")

        #flash('There was a http error with this request', 'danger')
        return Response("There was a http error with this request", status=500)

    except requests.exceptions.TooManyRedirects as e:
        app.logger.info(e)

        #flash('There was a too many redirects error with this request', 'danger')
        return Response("There was a too many redirects error with this request", status=500)

    except requests.exceptions.RequestException as e:
        app.logger.info(e)

        #flash('There was an error with this request', 'danger')
        return Response("There was an error with this request", status=500)
