import { useEffect, useState, useRef } from "react";
import DataModel from "@packages/data-model";
import handleRemoteData from "@packages/form-render/common/remote-data";

import moment from "moment";

import "./index.less";

function isBetweenLayout(it) {
  if (it.mode === "textarea") {
    return false;
  }
  return true;
}

const dateFormatEnum = {
  datetime: "YYYY-MM-DD HH-mm-ss",
  date: "YYYY-MM-DD",
};

function getVal(it, data = {}, opt = {}) {
  let val = data[it.name];
  const { type, mode } = it || {};
  if (type === "date-picker") {
    let format = dateFormatEnum[mode] || dateFormatEnum.date;
    return moment(val).format(format);
  }
  if (type === "select") {
    return it.options?.find((option) => option.value === val)?.label || val;
  }
  return val;
}

function DetailRender(props) {
  const { data = {}, model, schema, itemRender, getApi, query, config } = props;
  const { fieldList } = schema || {};

  const [_data, setData] = useState(data);

  useEffect(() => {
    // 处理远程选项
    handleRemoteData(fieldList, config, "detail").then(() => {
      // 刷新数据，保证显示正常
      setData((_data) => ({ ..._data }));
    });

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
        console.log(res);
        setData(res);
      });
  }, []);

  return (
    <div className="detail-render">
      {fieldList.map((it, idx) => {
        if (it.activated === false || it.visible === false) {
          return null;
        }
        if (itemRender) {
          return itemRender(it, idx);
        }

        return (
          <div
            className={`item-box ${
              isBetweenLayout(it) ? "item-between" : "item-vertical"
            }`}
            key={it.name + idx}
          >
            <div className="item-label">{it.label}</div>
            <div className="item-value">{getVal(it, _data)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default DetailRender;
