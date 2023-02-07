import { useEffect, useRef, useState } from "react";
import { Marker, TileLayer, Map, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, SpinLoading } from "antd-mobile";

import { mapConfig } from "../common/map-config";
import pointIconUrl from "../common/approachPointIcon.png";

import "./index.less";

// TODO: 删除测试数据
import carRoute from "./car-route.json";

/**
 * 获取路径规划结果
 * @param {Object} carRoute
 * @returns
 */
function getRouteSteps(carRoute) {
  const routeLatLngs = [];
  if (carRoute && carRoute.result && carRoute.result.routes) {
    const { routes } = carRoute.result;
    const { steps = [] } = (!Array.isArray(routes) ? routes : routes[0]) || {};
    if (Array.isArray(steps)) {
      steps.forEach((item) => {
        const path = item?.path || item?.polyline;
        path.split(";").forEach((xystr) => {
          const [x, y] = xystr.split(",");
          if (isFinite(x) && isFinite(y) && x !== "" && y !== "") {
            routeLatLngs.push([Number(x), Number(y)]);
          }
        });
      });
    }
  }
  //
  return routeLatLngs;
}

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

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [linePoints, setLine] = useState(null);
  const [currentPoint, setCurrentPoint] = useState("start");
  const [loading, setLoading] = useState(false);

  const mapRef = useRef();

  function onClickMap(e) {
    if (currentPoint === "start") {
      setStartPoint(e?.latlng);
      setCurrentPoint("end");
    }
    if (currentPoint === "end") {
      setEndPoint(e?.latlng);
      setCurrentPoint("start");
    }
  }

  useEffect(() => {
    console.log(startPoint, endPoint);
    if (startPoint && endPoint) {
      getRouteByStartEnd(startPoint, endPoint).then((res) => {
        setLine(res);
      });
    }
  }, [startPoint, endPoint]);

  useEffect(() => {
    map = mapRef?.current?.contextValue?.map;

    // TODO: 数据回填
    if (data && data.lng && data.lat) {
      const { lat, lng } = data;
      map.setView(L.latLng(lat, lng), mapConfig.zoom);
      // setStartPoint();
      // setEndPoint();
      // setLine();
    }
  }, []);

  // TODO: 改为正确的请求数据逻辑
  function getRouteByStartEnd(start, end) {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(getRouteSteps(carRoute).map((item) => item.reverse()));
        setLoading(false);
      }, 1000);
    });
  }

  function onSave() {
    onConfirm &&
      onConfirm({
        start: startPoint,
        end: endPoint,
        line: linePoints,
      });
  }

  return (
    <div className="line-picker">
      <Map
        className="line-picker-map"
        {...mapConfig}
        ref={mapRef}
        onclick={onClickMap}
      >
        <TileLayer url={mapUrl} />
        {startPoint && (
          <Marker key={`marker-start`} position={startPoint} icon={LeafIcon} />
        )}
        {endPoint && (
          <Marker key={`marker-end`} position={endPoint} icon={LeafIcon} />
        )}
        {startPoint && endPoint && linePoints && (
          <Polyline
            key={`path_${linePoints.length}`}
            positions={linePoints}
            color={"#f00"}
            weight={8}
          />
        )}
      </Map>
      <div className="line-start-end-show">
        <div
          className={currentPoint === "start" ? "active-point" : ""}
          onClick={() => {
            setCurrentPoint("start");
          }}
        >
          起点：{startPoint?.lng},{startPoint?.lat}
        </div>
        <div
          className={currentPoint === "end" ? "active-point" : ""}
          onClick={() => {
            setCurrentPoint("end");
          }}
        >
          终点：{endPoint?.lng}, {endPoint?.lat}
        </div>
      </div>
      <div className="line-picker-footer">
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
