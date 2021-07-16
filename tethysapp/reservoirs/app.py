from tethys_sdk.base import TethysAppBase, url_map_maker


class Reservoirs(TethysAppBase):
    """
    Tethys app class for Reservoirs."
    """

    name = 'Reservoirs'
    index = 'reservoirs:home'
    icon = 'reservoirs/images/icon.gif'
    package = 'reservoirs'
    root_url = 'reservoirs'
    color = '#008080'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='reservoirs',
                controller='reservoirs.controllers.home'
            ),
            UrlMap(
                name='getMySites',
                url='getMySites/',
                controller='reservoirs.controllers.GetSites'
            ),
            UrlMap(
                name='GetSiteInfo',
                url='GetSiteInfo/',
                controller='reservoirs.controllers.GetInfo'
            ),
            UrlMap(
                name='GetValues',
                url='GetValues/',
                controller='reservoirs.controllers.GetValues'
            ),
            UrlMap(
                name='getTimeSeries',
                url='getTimeSeries/',
                controller='reservoirs.controllers.getTimeSeries'
            ),
            UrlMap(
                name='getMonthlyAverage',
                url='getMonthlyAverage/',
                controller='reservoirs.controllers.getMonthlyAverage'
            )
        )

        return url_maps