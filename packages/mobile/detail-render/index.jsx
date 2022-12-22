import { useEffect, useState, useRef } from "react";
import _ from "lodash";

import DataModel from "@/services/data-model";
import handleRemoteData from "@packages/form-render/common/remote-data";

import moment from "moment";

import "./index.less";

function getLayout(layout, it) {
  if (layout === "start") {
    return "item-start";
  }
  if (it.mode === "textarea") {
    return "item-vertical";
  }
  return "item-between";
}

const dateFormatEnum = {
  datetime: "YYYY-MM-DD HH:mm:ss",
  date: "YYYY-MM-DD",
};

function getVal(it, data = {}, opt = {}) {
  let val = _.get(data, it.name);
  const { type, mode } = it || {};
  if (type === "date-picker") {
    let format = dateFormatEnum[mode] || dateFormatEnum.date;
    return moment(val).format(format);
  }
  if (type === "select") {
    return it.options?.find((option) => option.value === val)?.label || val;
  }
  if (Array.isArray(val)) {
    return val.join("、");
  }
  return val;
}

function DetailRender(props) {
  const {
    layout,
    data = {},
    model,
    schema,
    itemRender,
    getApi,
    query,
    config,
  } = props;
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
            className={`item-box ${getLayout(layout, it)}`}
            key={it.name + idx}
          >
            <div className="item-label">
              {it.label}
              {layout === "start" ? "：" : ""}
            </div>
            <div className="item-value">{getVal(it, _data)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default DetailRender;
