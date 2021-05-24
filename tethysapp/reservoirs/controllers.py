from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
import pywaterml.waterML as pwml
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from tethys_sdk.gizmos import SelectInput, RangeSlider
from tethys_sdk.permissions import login_required
from tethys_sdk.workspaces import app_workspace

import json


@login_required()
def home(request):
    """
    Controller for the app home page.
    """

    url = "http://128.187.106.131/app/index.php/dr/services/cuahsi_1_1.asmx?WSDL"
    water = pwml.WaterMLOperations(url=url)
    sites = water.GetSites()
    sites_js = json.dumps(sites)
    print(sites_js)

    variables = SelectInput(
        display_text='Select a Reservoir',
        name='variables',
        multiple=False,
        original=True,
        options=(('testing', '1'),
        ),
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