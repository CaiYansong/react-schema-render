import { useEffect, useState, useRef } from "react";
import _ from "lodash";
import { PullToRefresh } from "antd-mobile";

import DataModel from "../../utils/data-model";
import handleRemoteData from "../form-render/common/remote-data";

import { getVal } from "./common/utils";

import "./index.less";

function DetailRender(props) {
  const {
    layout,
    data,
    model,
    schema,
    itemRender,
    getApi,
    query,
    config,
    slots,
    hasPullRefresh,
  } = props;
  const { formConf = {}, fieldList } = schema || {};

  const [_data, setData] = useState(data);

  useEffect(() => {
    // 处理远程选项
    handleRemoteData(fieldList, config, "detail").then(() => {
      // 刷新数据，保证显示正常
      setData((_data) => ({ ..._data }));
    });

    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  function getData() {
    let dm = model;
    if (!dm && getApi) {
      dm = new DataModel({
        getApi: getApi,
        query,
      });
    }

    dm &&
      dm.get &&
      dm.get().then((res) => {
        setData(res);
      });
  }

  return (
    <div className="detail-render">
      <PullToRefresh disabled={!hasPullRefresh} onRefresh={getData}>
        {fieldList.map((it, idx) => {
          if (it.activated === false || it.visible === false) {
            return null;
          }
          if (itemRender) {
            return itemRender(it, idx);
          }

          return (
            <div
              className={`item-box ${getLayout(layout, it)}`}
              key={it.name + idx}
            >
              <div
                className="item-label"
                style={{ width: formConf.labelWidth }}
              >
                {it.label}
                {layout === "start" ? "：" : ""}
              </div>
              <div className="item-value">
                {slots && slots[it.name]
                  ? typeof slots[it.name] === "function"
                    ? slots[it.name](it, getVal(it, _data), _data)
                    : slots[it.name]
                  : getVal(it, _data)}
              </div>
            </div>
          );
        })}
      </PullToRefresh>
    </div>
  );
}

function getLayout(layout, it) {
  if (layout === "start") {
    return "item-start";
  }
  if (it.mode === "textarea") {
    return "item-vertical";
  }
  return "item-between";
}

export default DetailRender;
