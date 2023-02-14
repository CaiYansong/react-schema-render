import { useState, useEffect } from "react";
import { Form, Select } from "antd";

import { getRemoteData } from "../../common/remote-data";

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
    clearable,
    multiple,
    searchable,
    placeholder = "请选择",
    options,
  } = field;

  const [_options, setOptions] = useState(options || []);

  useEffect(() => {
    if (options) {
      setOptions(options);
    }
  }, [options]);

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

  // 处理远程数据的逻辑
  useEffect(() => {
    if (!field.isRemote) {
      return;
    }
    getRemoteData(field, config, scenario).then((list) => {
      setOptions(list);
    });
  }, [field.isRemote]);

  return (
    <Form.Item {...formItemProps}>
      <Select {..._props} style={{ width: "100%" }} options={_options}></Select>
    </Form.Item>
  );
}

export default SelectCom;
