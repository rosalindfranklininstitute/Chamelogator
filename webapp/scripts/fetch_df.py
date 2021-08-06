import pandas as pd

from ..models.datadb import db, Sessions, SampleDetails, Operations, Plunges, Treatments, Dispenses, Grids

def get_df():

    bind = db.session.bind

    sessions_query = db.session.query(Sessions)
    sample_query = db.session.query(SampleDetails)
    operations_query = db.session.query(Operations)
    plunges_query = db.session.query(Plunges)
    treatments_query = db.session.query(Treatments)
    dispenses_query = db.session.query(Dispenses)
    grids_query = db.session.query(Grids)

    sessions = pd.read_sql_query(sessions_query.statement, bind)
    samples = pd.read_sql_query(sample_query.statement, bind)
    operations = pd.read_sql_query(operations_query.statement, bind)
    plunges = pd.read_sql_query(plunges_query.statement, bind)
    treatments = pd.read_sql_query(treatments_query.statement, bind)
    dispenses = pd.read_sql_query(dispenses_query.statement, bind)
    grids = pd.read_sql_query(grids_query.statement, bind)


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
    d = pd.merge(
        c, plunges, "outer", left_on="ROWID_y", right_on="OperationId"
    )
    e = pd.merge(d, treatments, "outer", left_on="GridId", right_on="GridId")
    f = pd.merge(
        e, dispenses, "outer", left_on="ROWID_y", right_on="OperationId"
    )

    labels = ["SessionId", "OperationId_x", "OperationId_y", "ROWID"]
    app.logger.info(f"dropping: {labels}")
    f.drop(labels, axis=1, inplace=True)
    f.rename(columns={"ROWID_x": "SessionId", "ROWID_y": "OperationId", \
        "DateTimeUTC_x": "SessionTime", "DateTimeUTC_y": "OperationTime"}, inplace=True)

    # Sort the new massive dataframe be ascending Session IDs
    f.sort_values(by=["SessionId"], ascending=True, inplace=True)
    df = f.dropna(subset=['SessionId'])

    return df