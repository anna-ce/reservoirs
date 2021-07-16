from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
import pywaterml.waterML as pwml
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from tethys_sdk.gizmos import SelectInput, RangeSlider
from tethys_sdk.permissions import login_required
import numpy as np
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
    site_fullcode = df_sites['fullSiteCode']
    sites_presa = [('None', 'none')]


    for sn, sf in zip(site_name, site_fullcode):
        if 'Presa' in sn:
            reservoir = (sn, sf)
            sites_presa.append(reservoir)

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

    return JsonResponse(return_object)

def getMonthlyAverage(request):

    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    m_avg = water.GetMonthlyAverage(None, site_full_code, variable_full_code, start_date, end_date)

    data = {'Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'Monthly Average': m_avg,
            }
    return_object = pd.DataFrame(data, columns=['Months', 'Monthly Average'])

    return JsonResponse(return_object)


def getTimeSeries(request):

    return_object = {}
    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    sites = water.GetSites()

def GetInfo(request):

    return_object = {}
    mysiteinfo = []
    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    sites = water.GetSites()

    for site in sites:
        mysiteinfo.append(water.GetSiteInfo(site['fullSiteCode']))

    return_object['siteInfo'] = mysiteinfo

    return JsonResponse(return_object)

def GetValues(request):

    return_object = {}
    myvalues = []
    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    values = water.GetValues(site_full_code, variable_full_code)
    print(values)

    return JsonRespons(return_object)

    # PLOT THE TIME SERIES
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
