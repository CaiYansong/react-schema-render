import { useState, useRef, useEffect } from "react";
import { Button } from "antd";

import FormRender from "@packages/form-render";

import "./index.less";

function QueryRender(props) {
  // TODO: query 特有 schema 格式处理
  const [schema, setSchema] = useState(props.schema);
  const form = useRef();

  useEffect(() => {
    const list = [];
    if (props.search) {
      list.push({
        name: "search",
        label: "",
        type: "input",
        placeholder: props.search,
        clearable: true,
      });
    }
    const { fieldList } = props.schema || {};

    props.filters?.forEach((key) => {
      const item = fieldList.find((it) => it.name === key);
      if (item) {
        // TODO: 优化
        list.push({
          ...item,
          activated: true,
          visible: true,
        });
      } else if (key === "$timerange") {
        list.push({
          name: "$timerange",
          label: "时间范围",
          type: "date-picker",
          mode: "datetimerange",
          activated: true,
          visible: true,
          submitOnChange: true,
        });
      }
    });

    setSchema({
      formConf: props.schema?.formConf,
      fieldList: list,
    });
  }, [props.search, props.filters, props.schema]);

  function onSearch() {
    console.log("onSearch");
    props.onSearch && props.onSearch(form.current || {});
  }

  function onFormChange(cur, allValues) {
    let date = null;
    let key = Object.keys(cur);
    if (key) {
      key = key[0];
    }
    const timeRangeVal = cur.$timerange;
    if (key === "$timerange" && timeRangeVal) {
      date = {};
      if (Array.isArray(timeRangeVal) && timeRangeVal.length === 2) {
        date.startTime = timeRangeVal[0]?.format("YYYY-MM-DD HH:mm:ss");
        date.endTime = timeRangeVal[1]?.format("YYYY-MM-DD HH:mm:ss");
      } else {
        date.startTime = undefined;
        date.endTime = undefined;
      }
    }
    console.log("date", date);
    if (date) {
      delete allValues.$timerange;
      form.current = { ...date, ...allValues };
    } else {
      form.current = allValues;
    }
  }

  return (
    <div className="query-render">
      {schema.fieldList?.length > 0 ? (
        <FormRender
          className="query-form"
          inline
          schema={schema}
          config={props.formConf}
          submitRender={
            <Button type="primary" onClick={onSearch}>
              搜索
            </Button>
          }
          fieldSubmit={onSearch}
          onChange={onFormChange}
        />
      ) : null}
    </div>
  );
}

export default QueryRender;
