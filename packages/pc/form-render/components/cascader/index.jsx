import { useState, useEffect } from "react";
import { Form, Cascader as Ca } from "antd";

import { getRemoteData } from "../../common/remote-data";

function Cascader(props) {
  const { scenario, field = {}, data = {}, config, onChange } = props;

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

  // 处理远程数据的逻辑
  useEffect(() => {
    if (!field.isRemote) {
      return;
    }
    getRemoteData(field, config, scenario).then((list) => {
      setOptions(list);
    });
  }, [field.isRemote]);

  const _props = {
    id: name,
    value: data,
    allowClear: clearable,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    showSearch: searchable,
    mode: multiple === true ? "multiple" : undefined,
    placeholder,
    options: _options,
    onClear: onChange,
    onChange: onChange,
    fieldNames: {
      label: field.labelKey || "label",
      value: field.valueKey || "value",
      children: field.childrenKey || "children",
    },
  };

  return (
    <Form.Item {...props.formItemProps}>
      <Ca {..._props}></Ca>
    </Form.Item>
  );
}

export default Cascader;
