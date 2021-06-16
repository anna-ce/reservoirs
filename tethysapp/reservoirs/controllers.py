from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
import pywaterml.waterML as pwml
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from tethys_sdk.gizmos import SelectInput, RangeSlider
from tethys_sdk.permissions import login_required
from tethys_sdk.workspaces import app_workspace
import numpy as np
import json
import pandas as pd


@login_required()
def home(request):

    """
    Controller for the app home page.
    """

    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    sites = water.GetSites()
    df_sites = pd.DataFrame.from_dict(sites)
    site_name = df_sites['sitename']

    sites_presa = [('None', 'none')]
    x=1
    for site in site_name:
        if 'Presa' in site:
            reservoir = (site, x)
            sites_presa.append(reservoir)
            x = x + 1

    variables = SelectInput(
        display_text='Select a Reservoir',
        name='variables',
        multiple=False,
        original=True,
        options=tuple(sites_presa)
    )

    context = {
        'variables': variables,
    }

    return render(request, 'reservoirs/home.html', context)

def GetSites(request):

    return_object = {}
    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    sites = water.GetSites()
    return_object['siteInfo'] = sites

    #PLOT THE TIME SERIES
    # timeStamps = []
    # valuesTimeSeries = []
    # for index in variableResponse['values']:
    #     timeStamps.append(index['dateTimeUTC'])
    #     valuesTimeSeries.append(index['dataValue'])
    #
    # fig = go.Figure(data=go.Scatter(x=timeStamps, y=valuesTimeSeries))
    # # Edit the layout
    # fig.update_layout(title=variableResponse['values'][VARIABLE]['Water Elevation'],
    #                   xaxis_title=variableResponse['values'][VARIABLE]['day'],
    #                   yaxis_title=variableResponse['values'][VARIABLE]['m'])
    # fig.show()
    #
    # df = pd.DataFrame(dict(
    #     data=valuesTimeSeries
    # ))
    # fig = px.box(df, y="data", points="all")
    # fig.show()

    return JsonResponse(return_object)
