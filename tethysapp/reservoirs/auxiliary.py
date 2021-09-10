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

from .app import Reservoirs as app


def make_storagecapcitycurve(site_name_only):
    rating_curves_file_path = os.path.join(app.get_app_workspace().path, 'rating_curves_DR.xlsx')
    rating_curves = pd.read_excel(rating_curves_file_path).dropna()
    df_rc = pd.DataFrame({'volume_rc': rating_curves[f'{site_name_only}_Vol_MCM'].to_list(),'elevation_rc': rating_curves[f'{site_name_only}_Elev_m'].to_list()})
    df = df_rc.values.tolist()
    return df
