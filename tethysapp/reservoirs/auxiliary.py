import pywaterml.waterML as pwml
import numpy as np
import json
import os
from tethys_sdk.workspaces import app_workspace
import numpy as np
import json
import plotly as pl
import pandas as pd
import geoglows
import datetime
from datetime import date
from datetime import timedelta
from scipy import integrate
import calendar

from .app import Reservoirs as app


def make_storagecapcitycurve(site_name_only):
    rating_curves_file_path = os.path.join(app.get_app_workspace().path, 'rating_curves_DR.xlsx')
    rating_curves = pd.read_excel(rating_curves_file_path).dropna()
    df_rc = pd.DataFrame({'volume_rc': rating_curves[f'{site_name_only}_Vol_MCM'].to_list(),'elevation_rc': rating_curves[f'{site_name_only}_Elev_m'].to_list()})
    df = df_rc.values.tolist()
    return df

def get_historicaldata(site_name_only):

    # open the sheet with historical levels
    app_workspace = app.get_app_workspace()
    damsheet = os.path.join(app_workspace.path, 'elevations.xlsx')
    # read the sheet, get the water level info (nivel) corresponding to the correct reservoir name
    dfnan = pd.read_excel(damsheet)
    df1 = dfnan[['Nivel', site_name_only]]
    df = df1.dropna()  # drop null values from the series
    values = []

    # convert the date listed under nivel to a python usable form and make an entry with the date/value to the list
    for index, row in df.iterrows():
        time = row["Nivel"]
        # time = datetime.datetime.strptime(str(time)[0:10], "%Y-%m-%d")
        # timestep = calendar.timegm(time.utctimetuple()) * 1000
        timestep = time
        values.append([timestep, row[site_name_only]])

    # not sure why we do this, but it was left over from the old version of the app
    # if reservoir_name == 'Bao':
    #     del values[0]
    #     del values[0]
    # elif reservoir_name == 'Moncion':
    #     del values[0]

    histdata = {
        'values': values,
        'lastdate': time,
    }
    return histdata
