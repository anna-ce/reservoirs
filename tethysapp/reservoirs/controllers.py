from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
import pywaterml.waterML as pwml
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from tethys_sdk.gizmos import SelectInput, RangeSlider
from tethys_sdk.permissions import login_required
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

BASE_URL = app.get_custom_setting('Hydroser_Endpoint')
@login_required()
def home(request):

    """
    Controller for the app home page.
    """

    # url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    try:
        water = pwml.WaterMLOperations(url=BASE_URL)
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

    except Exception as e:
        print(e)
        variables = SelectInput(
            display_text='Select a Reservoir',
            name='variables',
            multiple=False,
            original=True,
            options=tuple([])
        )

        context = {
            'variables': variables,
        }
        return render(request, 'reservoirs/home.html', context)



def GetSites(request):

    return_object = {}
    # url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=BASE_URL)
    sites = water.GetSites()
    return_object['siteInfo'] = sites

    return JsonResponse(return_object)

# def getMonthlyAverage(request):
#
#     url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
#     water = pwml.WaterMLOperations(url=url)
#     m_avg = water.GetMonthlyAverage(None, site_full_code, variable_full_code, start_date, end_date)
#
#     data = {'Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
#             'Monthly Average': m_avg,
#             }
#     return_object = pd.DataFrame(data, columns=['Months', 'Monthly Average'])
#
#     return JsonResponse(return_object)
#
#
# def getTimeSeries(request):
#
#     return_object = {}
#     url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
#     water = pwml.WaterMLOperations(url=url)
#     sites = water.GetSites()

def GetInfo(request):

    fullsitecode = request.GET.get("full_code")
    return_object = {}
    mysiteinfo = []
    # myvalues = []
    # url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=BASE_URL)

    mysiteinfo.append(water.GetSiteInfo(fullsitecode))

    return_object['siteInfo'] = mysiteinfo


    return JsonResponse(return_object)

def GetValues(request):

    fullsitecode = request.GET.get("full_code")
    return_object = {}
    mysiteinfo = []
    myvalues = []
    # url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=BASE_URL)

    mysiteinfo.append(water.GetSiteInfo(fullsitecode))

    start_date = mysiteinfo[0]['siteInfo'][0]['beginDateTime']
    end_date = mysiteinfo[0]['siteInfo'][0]['endDateTime']
    variable_full_code = 'RES-EL'
    values_x = water.GetValues(fullsitecode, variable_full_code, start_date, end_date)
    myvalues.append(values_x)
    timeStamps = []
    valuesTimeSeries = []
    # for index in myvalues:
    #     timeStamps.append(index['dateTimeUTC'])
    #     valuesTimeSeries.append(index['dataValue'])
    #
    # fig = go.Figure(data=go.Scatter(x=timeStamps, y=valuesTimeSeries))
    # # Edit the layout
    # fig.update_layout(title=myvalues[0]['variableName'],
    #                   xaxis_title=myvalues[0]['timeUnitAbbreviation'],
    #                   yaxis_title=myvalues[0]['unitAbbreviation'])
    # fig.show()
    #
    # df = pd.DataFrame(dict(
    #     data=valuesTimeSeries
    # ))
    # fig = px.box(df, y="data", points="all")
    # fig.show()

    return_object['myvalues'] = myvalues

    return JsonResponse(return_object)

def GetForecast(request):
    return_object = {}
    rating_curves_file_path = os.path.join(app.get_app_workspace().path, 'rating_curves_DR.xlsx')
    rating_curves = pd.read_excel(rating_curves_file_path)

    site_name = request.GET.get("site_name")
    print(site_name)
    site_name_only = site_name.split(' ')[-1]
    print(site_name_only)
    streams_json_file_path = os.path.join(app.get_app_workspace().path, 'streams.json')
    wlh_json_file_path = os.path.join(app.get_app_workspace().path, 'waterLevel_hist.json')

    with open(streams_json_file_path) as f:
        stream_data_reservoir = json.load(f)

    with open(wlh_json_file_path) as f:
        wlh_data_reservoir = json.load(f)

    df_rc = pd.DataFrame({'volume_rc': [rating_curves[f'{site_name_only}_Vol_MCM']],'elevation_rc': [rating_curves[f'{site_name_only}_Elev_m']]})
    volume_datetime = [0]*15
    daily_vtotal_max = [0]*15
    daily_vtotal_75 = [0]*15
    daily_vtotal_avg = [0]*15

    try:
        for id in stream_data_reservoir[site_name]:
            df = geoglows.streamflow.forecast_stats(id, 'csv')
            df_max = df["flow_max_m^3/s"].dropna()
            s5_df = df["flow_75%_m^3/s"].dropna()
            df_avg = df["flow_avg_m^3/s"].dropna()
            volumes_max = []
            volumes_75 = []
            volumes_avg = []

            volumes_max.append(integrate.trapz(y = df_max[0:8], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[8:16], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[16:24], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[24:32], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[32:40], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[40:48], dx = 10800 ))
            volumes_max.append(integrate.trapz(y = df_max[48:52], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[52:56], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[56:60], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[60:64], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[64:68], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[68:72], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[72:76], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[76:80], dx = 21600 ))
            volumes_max.append(integrate.trapz(y = df_max[80:84], dx = 21600 ))

            volumes_75.append(integrate.trapz(y = s5_df[0:8], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[8:16], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[16:24], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[24:32], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[32:40], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[40:48], dx = 10800 ))
            volumes_75.append(integrate.trapz(y = s5_df[48:52], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[52:56], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[56:60], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[60:64], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[64:68], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[68:72], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[72:76], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[76:80], dx = 21600 ))
            volumes_75.append(integrate.trapz(y = s5_df[80:84], dx = 21600 ))

            volumes_avg.append(integrate.trapz(y = df_avg[0:8], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[8:16], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[16:24], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[24:32], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[32:40], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[40:48], dx = 10800 ))
            volumes_avg.append(integrate.trapz(y = df_avg[48:52], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[52:56], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[56:60], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[60:64], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[64:68], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[68:72], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[72:76], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[76:80], dx = 21600 ))
            volumes_avg.append(integrate.trapz(y = df_avg[80:84], dx = 21600 ))

            i=0
            while i < len(volumes_max):
                daily_vtotal_max[i] = daily_vtotal_max[i] + volumes_max[i]
                daily_vtotal_75[i] = daily_vtotal_75[i] + volumes_75[i]
                daily_vtotal_avg[i] = daily_vtotal_avg[i] + volumes_avg[i]
                volume_datetime[i] = date.today() + timedelta(days = i)
                i = i + 1

        # return_object['max'] = daily_vtotal_max
        # return_object['se5'] = daily_vtotal_75
        # return_object['avg'] = daily_vtotal_avg
        # return_object['date'] = volume_datetime

        #volume to elevation
        presa_rc_vol = df_rc['volume_rc'][0]
        presa_rc_elev = df_rc['elevation_rc'][0]
        print(presa_rc_vol)
        # print(presa_rc_elev)
        elevations_max =[]
        elevations_75 =[]
        elevations_avg =[]
        # print(daily_vtotal_max)
        for volume_max, volume_75, volume_avg in zip(daily_vtotal_max,daily_vtotal_75,daily_vtotal_avg):

            lookup_max = min(range(len(presa_rc_vol)), key=lambda i: abs(presa_rc_vol[i]-(volume_max/1000000)))
            lookup_75 = min(range(len(presa_rc_vol)), key=lambda i: abs(presa_rc_vol[i]-(volume_75/1000000)))
            lookup_avg = min(range(len(presa_rc_vol)), key=lambda i: abs(presa_rc_vol[i]-(volume_avg/1000000)))
            # print(abs(presa_rc_vol[0]-(volume_max/1000000)),lookup_max)

            matching_elev_max = presa_rc_elev[lookup_max] + wlh_data_reservoir[site_name]['dataValue']
            matching_elev_75 = presa_rc_elev[lookup_75] + wlh_data_reservoir[site_name]['dataValue']
            matching_elev_avg = presa_rc_elev[lookup_avg] + wlh_data_reservoir[site_name]['dataValue']
            # print(matching_elev_max,matching_elev_75,matching_elev_avg)
            elevations_max.append(matching_elev_max)
            elevations_75.append(matching_elev_75)
            elevations_avg.append(matching_elev_avg)

        # print(elevations_max)
        return_object['max'] = elevations_max
        return_object['se5'] = elevations_75
        return_object['avg'] = elevations_avg
        return_object['date'] = volume_datetime
    except KeyError as e:
        return_object['error'] = f'The reservoir {site_name} does not have forecast data available.'
        print(e)

    return JsonResponse(return_object)
