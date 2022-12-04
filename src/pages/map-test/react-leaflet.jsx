import { Marker, TileLayer, Map, useLeaflet } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import {} from 'antd';

import pointIconUrl from '@/assets/img/approachPointIcon.png';

const Config = {
  mapboxMapUrl:
    'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?sku=10139EHAhiEm6&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p1dHRybDR5MGJuZjQzcGhrZ2doeGgwNyJ9.a-vxW4UaxOoUMWUTGnEArw',
  // mapUrl: "https://t3.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=990af3d2adae976d53f84f21b0195333" // 天地图
  // mapUrl: 'https://xlbw-ca.hzos.hzs.zj/v3/tile?z={z}&x={x}&y={y}', // 市局高德地图
  mapUrl:
    'https://gddt.hzos.hzs.zj/tileMap/services/3857/bzdz_3857/{z}/{y}/{x}.png', // 市局高德地图
  // mapUrl: 'https://gddt.hzos.hzs.zj/tileMap/services/msef4c45d189/tile/{z}/{y}/{x}', // 市局高德地图
  // mapUrl: 'https://gddt.hzos.hzs.zj/tileMap/services/MapServer/msef4c45d189/tile/{z}/{y}/{x}?startLevel=1',
  shenseMapUrl: 'https://xlbw-ca.hzos.hzs.zj/shense/v3/tile?z={z}&x={x}&y={y}',
  darkMapUrl:
    'https://gddt.hzos.hzs.zj/tileMap/services/3857/ms5d8422d376/{z}/{y}/{x}.png', // 市局高德深蓝色地图
  deepBlue15:
    'https://gddt.hzos.hzs.zj/tileMap/services/3857/msef4c45d189/{z}/{x}/{y}.png',
  deepBlue18:
    'https://gddt.hzos.hzs.zj/tileMap/services/3857/msef4c45d189-18/{z}/{y}/{x}.png',
  darkMapUrl_4326:
    'https://gddt.hzos.hzs.zj/tileMap/services/MapServer/msef4c45d189/tile/{z}/{y}/{x}',
  satelliteMapUrl:
    'https://gddt.hzos.hzs.zj/tileMap/services/MapServer/osgb_Layers_y/tile/other/{z}/{y}/{x}',
  gaodeMapUrl:
    'https://gddt.hzos.hzs.zj/tileMap/services/3857/bzdz_3857/{z}/{y}/{x}.png', //配置地图
  // 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=3131a9355f28fb662853cfa719d3e160&x={x}&y={y}&z={z}',
  zhiMapUrl:
    'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}', // 深蓝色
};

const isDev = process.env.NODE_ENV === 'development';

const mapUrl = isDev ? Config.zhiMapUrl : Config.mapUrl;

const mapConfig = {
  center: [30.25027961206251, 120.16514401757941], //  默认地图展示位置
  minZoom: 3,
  maxZoom: 18,
  zoom: 14,
  attributionControl: false,
};

// 地图选中点图标
const LeafIcon = new L.Icon({
  iconUrl: pointIconUrl,
  iconSize: [30, 40],
});

function ReactLeafletMap(props) {
  const [point, setPoint] = useState(null);
  const mapRef = useRef();

  function onClickMap(e) {
    setPoint(e?.latlng);
    console.log('onClickMap', e);
  }

  function getCurentLocation() {
    const map = mapRef?.current?.contextValue?.map;
    console.log('map', map);
    console.log('getCurentLocation loading...');
    // L.latLng(lat, lng)
    map.setView(
      L.latLng(30.16908223955199, 120.25893400248606),
      mapConfig.zoom,
    );
    return;
    navigator.geolocation.getCurrentPosition((position) => {
      // TODO: 坐标系转化 正常 -> 高德坐标系
      console.log('position', position);
      const { coords } = position;
      console.log('[coords.longitude, coords.latitude]', [
        coords.longitude,
        coords.latitude,
      ]);
      // var myMap = new L.Map('map', {
      //     maptype: 'dreamy',
      //     poi: true,
      //     traffic: true,
      //     center: [position.coords.latitude, position.coords.longitude],
      //     zoom: 8
      // });
    });
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <span>经度：{point?.lng}</span>
        &nbsp;
        <span>纬度：{point?.lat}</span>
        <span
          style={{ padding: '0 8px', cursor: 'pointer' }}
          onClick={getCurentLocation}
        >
          i
        </span>
      </div>
      <Map
        style={{ height: '500px' }}
        {...mapConfig}
        className="mapContainer"
        ref={mapRef}
        onclick={onClickMap}
      >
        <TileLayer url={mapUrl} />
        {point && <Marker key={`marker`} position={point} icon={LeafIcon} />}
      </Map>
    </>
  );
}

export default ReactLeafletMap;
