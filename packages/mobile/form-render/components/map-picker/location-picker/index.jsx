import { useEffect, useRef, useState } from "react";
import { Marker, TileLayer, Map, useLeaflet } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, SpinLoading } from "antd-mobile";

import { wgs84togcj02 } from "../gpsConvert";

import { mapConfig } from "../map-config";
import pointIconUrl from "../approachPointIcon.png";

import "./index.less";

// 地图选中点图标
const LeafIcon = new L.Icon({
  iconUrl: pointIconUrl,
  iconSize: [30, 40],
});

let map = null;

function ReactLeafletMap(props) {
  const {
    onConfirm,
    onCancel,
    data,
    // TODO: 切换成正确的地址（通过 props | config 传递？）
    mapUrl = "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
  } = props;
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();

  function onClickMap(e) {
    setPoint(e?.latlng);
  }

  function getCurrentPosition() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;
        const [lat, lng] = wgs84togcj02(
          coords.longitude,
          coords.latitude,
          true,
        );
        setPoint({ lat, lng });
        map.setView(L.latLng(lat, lng), mapConfig.zoom);
        setLoading(false);
      },
      (error) => {
        console.error("getCurrentPosition", error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  }

  useEffect(() => {
    map = mapRef?.current?.contextValue?.map;

    // 数据回填
    if (data && data.lng && data.lat) {
      const { lat, lng } = data;
      map.setView(L.latLng(lat, lng), mapConfig.zoom);
      setPoint({ lat, lng });
    } else {
      // 获取初始位置
      getCurrentPosition();
    }
  }, []);

  function onSave() {
    onConfirm && onConfirm(point);
  }

  return (
    <div className="location-picker">
      <div className="location-picker-header">
        <span>经度：{point?.lng}</span>
        &nbsp;
        <span>纬度：{point?.lat}</span>
        <span className="get-current-location-btn" onClick={getCurrentPosition}>
          获取当前坐标
        </span>
      </div>
      <Map
        className="location-picker-map"
        {...mapConfig}
        ref={mapRef}
        onclick={onClickMap}
      >
        <TileLayer url={mapUrl} />
        {point && <Marker key={`marker`} position={point} icon={LeafIcon} />}
      </Map>
      <div className="location-picker-footer">
        <Button className="footer-btn" onClick={onCancel}>
          取消
        </Button>
        <Button
          className="footer-btn"
          color="primary"
          fill="solid"
          onClick={onSave}
        >
          确定
        </Button>
      </div>
      {loading ? (
        <div className="loading-wrap">
          <SpinLoading />
        </div>
      ) : null}
    </div>
  );
}

export default ReactLeafletMap;
