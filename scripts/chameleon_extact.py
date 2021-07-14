import sqlite3
import pandas as pd
import numpy as np
from pprint import PrettyPrinter

pp = PrettyPrinter()


class ChameleonExtract(object):
    def __init__(self):
        self.con = None
        self.cur = None

        self.df = None

        self.connect_db()
        self.fetch_dfs()
        self.merge_dfs()

    def connect_db(self):

        # Set up connection to Chameleon database
        self.con = sqlite3.connect("../data/chameleon.db")
        self.cur = self.con.cursor()

    def fetch_dfs(self):
        # Read all the relevant tables in the Chameleon database and store their data into dataframes
        self.sessions = pd.read_sql_query(
            "SELECT ROWID as SessionId, DateTimeUTC, Project FROM Sessions", self.con
        )
        self.sample = pd.read_sql_query(
            "SELECT SessionId, ProteinClass, MolecularWeight, Concentration, \
                BufferDescription, BufferConcentration, DetergentType, \
                DetergentConcentration, GlycerolConcentration \
                FROM SampleDetails",
            self.con,
        )

        self.operations = pd.read_sql_query(
            "SELECT ROWID as OperationId, DateTimeUTC as OperationTime, GridId, \
                SampleDetailsId FROM Operations",
            self.con,
        )
        self.plunges = pd.read_sql_query(
            "SELECT OperationId, WickingTimeUsed, Mode as PlungeMode FROM Plunges", self.con
        )
        self.treatments = pd.read_sql_query(
            "SELECT GridId, GlowDischargeId FROM Treatments", self.con
        )
        # glow_discharges = cur.execute('SELECT )
        self.dispenses = pd.read_sql_query(
            "SELECT OperationId, SampleTimer FROM Dispenses", self.con
        )

        self.grids = pd.read_sql_query("SELECT ROWID as GridId FROM Grids", self.con)

        ## print(len(set(operations['SampleDetailsId'].to_numpy())))
        ## exit()

    def merge_dfs(self):

        # -----LINKS-----
        # operations SampleDetailsId == sessions ROWID == sample_details SessionId
        # operations GridId == plunges OperationId == treatments GridId == grids ROWID == dispenses OperationId
        # ----------------

        # Merge all of the dataframes together using keys common across tables
        a = pd.merge(
            self.sessions,
            self.sample,
            "outer",
            left_on="SessionId",
            right_on="SessionId",
        )
        b = pd.merge(
            a, self.operations, "outer", left_on="SessionId", right_on="SampleDetailsId"
        )  # SessionId and SampleDetailsId are the same!!!!
        c = pd.merge(b, self.grids, "outer", left_on="GridId", right_on="GridId")
        d = pd.merge(
            c, self.plunges, "outer", left_on="OperationId", right_on="OperationId"
        )
        e = pd.merge(d, self.treatments, "outer", left_on="GridId", right_on="GridId")
        f = pd.merge(
            e, self.dispenses, "outer", left_on="OperationId", right_on="OperationId"
        )

        # Sort the new massive dataframe be acsending Session IDs
        f.sort_values(by=["SessionId"], ascending=True, inplace=True)
        self.df = f

    def save_df(self):
        # Save the dataframe to a csv file
        self.df.to_csv("../data/pd.csv")

    def print_df(self):
        pp.pprint(self.df)



if __name__ == "__main__":

    cham = ChameleonExtract()

    #cham.print_df()
    cham.save_df()
