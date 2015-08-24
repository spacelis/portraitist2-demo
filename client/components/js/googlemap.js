/* global define */

define(['angular', 'resource_ctrl', 'GMaps', 'underscore', 'lenz', 'utils'], function(angular, ResourceCtrl, GMaps, _, L, utils){
  console.log('construct directive PIECHART');
  return ResourceCtrl.directive('googlemap', function(){
    console.log('init directive GOOGLEMAP');
    function link(scope, element, attr){
      scope.widget_name = attr.name;
      scope.widget_id = attr.id
      scope.globals = scope.$parent.globals;
      scope.settings = {
        dimension: {name: 'coord', label: 'Coordinates', type: 'text', tip: 'Format: Latitude,Longitude', value: '' }, 
        atmostpoi: {name: 'atmostpoit', label: 'Max number of POI to show on the map', type: 'text', tip: 'The default is 30.', value: '30'},
      };

      scope.settings.dimension.value = attr.dimension;

      // Build customized mapping creation
      // var mapping = {id: parse('id'), name: parse('name'), lat: parse('lat'), lng: parse('lng')};
      // Build dimension for data
      scope.map = new GMaps({
        lat: 41.0,
        lng: -100.0,
        height: attr.mapheight || '500px',
        div: angular.element('#' + scope.widget_id + ' .pt-map-canvas')[0],
        zoom: 3,
      });
      // For updating the map
      var render = function (){
        var accessor = utils.extractor({
          'lat': scope.settings.dimension.value.split(',')[0],
          'lon': scope.settings.dimension.value.split(',')[1],
        })
        if(scope._dimension){
          scope._dimension.dispose();
        }
        scope._dimension = scope.globals.data.dimension(function(d){
          var t = accessor.get(d);
          t.valueOf = function(){ return String(t.lat) + ' ' + String(t.lon); };
          return t});

        var group = scope._dimension.group().reduceCount();

        var pois = group.top(Number(scope.settings.atmostpoi.value));
        scope.map.removeMarkers();
        for(var i in pois) {
          if(pois[i].value === 0){ continue; }
          var poi = pois[i].key;
          if(!(poi.lat && poi.lon)){ continue; }
          scope.map.addMarker({
            lat: poi.lat,
            lng: poi.lon,
            title: poi.label,
            infoWindow: {
              content: poi.infow,
            },
            //icon: '/static/profileviewer/images/map_icons/' + poi.category.id + '_black.png',
          });
        }
        scope.map.fitZoom();
        if(scope.map.getZoom() > 17){
          scope.map.setZoom(17);
        }
      };
      scope.globals.register_renderer('googlemap', render);
      scope.globals.register_redrawer('googlemap', render);
    } // end of link func
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/googlemap.html',
      link: link
    };
  });
});
