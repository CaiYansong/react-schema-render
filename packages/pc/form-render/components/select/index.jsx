import { useState, useEffect } from "react";
import { Form, Select } from "antd";

import { getRemoteData } from "@packages/pc/form-render/common/remote-data";

function SelectCom(props) {
  const {
    formItemProps = {},
    field = {},
    data,
    scenario,
    config,
    onChange,
  } = props;

  const {
    name,
    disabled,
    readonly,
    clearable,
    multiple,
    searchable,
    placeholder = "请选择",
    options,
  } = field;

  const [_options, setOptions] = useState(options || []);

  const _props = {
    id: name,
    value: data,
    allowClear: clearable,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
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
