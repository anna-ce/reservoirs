
var GetSitesNow = function(){
     $.ajax({
          type: "GET",
          url: "getMySites/",
          dataType: "JSON",
          success: function(result) {
          var mySites = result.siteInfo;
          console.log(result.siteInfo);
          var myGoodSites = [];

          for(var i=0; i< mySites.length; ++i){
            if(mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa") ){
                myGoodSites.push(mySites[i]);
                // do it here//
            }
          }

//            var presa = ['Presa'];
//            const res = Object.values(result.siteInfo).filter(({
//                  sitename
//            }) => presa.includes(sitename));
//                console.log(res)
//            var output = result.filter function((obj){
//                return obj.siteInfo.sitename == filter_sites;
//            });
          }
      })
}
