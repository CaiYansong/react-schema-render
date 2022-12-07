import { Marker, TileLayer, Map, useLeaflet } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import {} from 'antd';

import pointIconUrl from '@/assets/img/approachPointIcon.png';

const Config = {
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
