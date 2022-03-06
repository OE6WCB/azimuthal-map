import './style.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4';
import * as olProj from 'ol/proj';
import {register} from 'ol/proj/proj4';
import {Fill, Stroke, Style, Text} from 'ol/style';

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs');
proj4.defs('ESRI:54032', '+proj=aeqd +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
//proj4.defs('WU:foo', '+proj=aeqd +lat_0=1 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
proj4.defs('WU:foo', '+proj=aeqd +lat_0=47.070 +lon_0=15.4350 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
proj4.defs('WU:foo2', '+proj=aeqd +lat_0=47.070 +lon_0=15.4350 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m');
//proj4.defs('PROJCS["WU:foo", CS[polar,2], AXIS["distance (r)",awayFrom,ORDER[1],LENGTHUNIT["metre",1.0]], AXIS["bearing (U)",clockwise,BEARING[234],ORDER[2], ANGLEUNIT["degree",0.0174532925199433] ]');
register(proj4);
//var proj27700 = olProj.get('EPSG:27700');
//proj27700.setExtent([0, 0, 700000, 1300000]);

var source_WU =
  new VectorSource({
    format: new GeoJSON(),
    attributions: ['naturalearthdata'],
    loader: function(extent, resolution, projection) {
      var url = 'data.geojson';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = function() {
        if(xhr.status == 200) {
          source_WU.addFeatures(
            source_WU.getFormat().readFeatures(xhr.responseText, {
              dataProjection: 'EPSG:4326',
              featureProjection: projection
            }));
        }
      }
      xhr.send();
    },
  });

let textStyle = new Style({
  text: new Text({
    text: '',
    overflow: true,
  }),
  stroke: new Stroke({
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(0,0,255,0.1)',
  }),
});

let wuStyleFunction = function(feature, resolution){
  textStyle.getText().setText(feature.get('abbrev'));
  return textStyle;
}

var map = new Map({
  target: 'map',
  layers: [
//    new TileLayer({
//      projection: 'EPSG:4326',
//      source: new OSM()
//    })
//    new VectorLayer({
//      background: '#1a2b39',
//      source: new VectorSource({
//        //url: 'http://localhost:3000/data.geojson',
//        url: './data.geojson',
//        projection: 'EPSG:4326',
//        //url: 'https://openlayers.org/data/vector/ecoregions.json',
//        format: new GeoJSON(),
//      })
//    })
    new VectorLayer({
      background: '#1a2b39',
      source: source_WU,
      style: wuStyleFunction,
    })
  ],
  view: new View({
    //projection: 'ESRI:54032',
    //projection: 'WU:foo',
    projection: 'WU:foo2',
    //projection: 'EPSG:27700',
    //projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 2
  })
});

//map.getOverlays().forEach(function(overlay){
//  var position = overlay.getPosition();
//  if (position) {
//      overlay.setPosition(ol.proj.transform(position, oldProjection, newProjection));
//  }
//});
//
//map.getLayers().forEach(function(layer) {
//  var source = layer.getSource();
//  if (source && source.forEachFeature) {
//      source.forEachFeature(function(feature) {
//          feature.getGeometry().transform(oldProjection, newProjection);
//      });
//  }
//});
