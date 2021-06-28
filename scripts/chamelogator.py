import pandas as pd
import numpy as np
import argparse
import re
import tabloo
from pprint import PrettyPrinter

pp = PrettyPrinter()

import chameleon_extact as cham_extr


def parse_args():
    # Set up parser to receive var from command line
    parser = argparse.ArgumentParser(
        description="Read a dataframe and determine if certain variables are present."
    )
    # parser.add_argument(
    #     "--grid",
    #     "-g",
    #     metavar="<GridId>",
    #     type=int,
    #     required=True,
    #     help="The ID of the grid to search for",
    # )
    parser.add_argument(
        "--option",
        "-o",
        metavar="<Option>",
        type=str,
        required=False,
        default="print",
        help="What to do with the dataframe",
    )
    parser.add_argument(
        "--session",
        "-s",
        metavar="<SessionId>",
        type=int,
        required=False,
        default=0,
        help="The ID of the session to fetch data for",
    )
    parser.add_argument(
        "--var",
        "-v",
        metavar="<Variable>",
        type=str,
        required=False,
        help="The variable to check for in the data",
    )

    args = parser.parse_args()

    # Get session and var from command line args
    option = args.option
    session = args.session
    # variable = args.var

    return option, session


class Chamelogator:
    def __init__(self):

        self.df = None

        self.extr = cham_extr.ChameleonExtract()

    def fetch_df(self):

        self.df = self.extr.df

    def read_df(self):

        # Read the csv file and store data in dataframe
        self.df = pd.read_csv("../data/pd.csv").drop(
            columns=["Unnamed: 0"], errors="ignore"
        )  # Drops the inherited id column from the csv


if __name__ == "__main__":

    option, session = parse_args()

    cham = Chamelogator()

    cham.fetch_df()

    # If a Session ID is provided...
    if session:
        # ...filter the dataframe to only include data for that session
        cham.df = cham.df.loc[df["SessionId"] == float(session)]

    # Sort the dataframe by Operation Time
    cham.df.sort_values(by=["OperationTime"], ascending=True, inplace=True)

    # Change to switch_case?
    if option == "print":
        pp.pprint(cham.df)
    elif option == "display":
        tabloo.show(cham.df)
