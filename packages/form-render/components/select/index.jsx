import { useState, useEffect } from "react";
import { Form, Select } from "antd";

import { getRemoteData } from "@packages/form-render/common/remote-data";

function SelectCom(props) {
  const {
    formItemProps = {},
    name,
    data,
    clearable,
    disabled,
    readonly,
    multiple,
    searchable,
    placeholder = "请选择",
    options,
    field,
    scenario,
    config,
    onChange,
  } = props;

  const [_options, setOptions] = useState(options || []);

  const _props = {
    id: name,
    value: data,
    allowClear: clearable,
    disabled,
    readOnly: readonly,
    showSearch: searchable,
    mode: multiple === true ? "multiple" : undefined,
    placeholder,
    onClear: onChange,
    onChange: onChange,
  };

  // 处理数据源为 func 的逻辑
  useEffect(() => {
    if (!props.isRemote) {
      return;
    }
    getRemoteData(field, config, scenario).then((list) => {
      setOptions(list);
    });
  }, [props.isRemote]);

  return (
    <Form.Item {...formItemProps}>
      <Select {..._props} style={{ width: "100%" }} options={_options}></Select>
    </Form.Item>
  );
}

export default SelectCom;
