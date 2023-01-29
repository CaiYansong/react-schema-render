import { Form, Cascader as Ca } from "antd";

function Cascader(props) {
  const { field = {}, data = {}, onChange } = props;

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

  const _props = {
    id: name,
    value: data,
    allowClear: clearable,
    disabled,
    readOnly: readonly,
    showSearch: searchable,
    mode: multiple === true ? "multiple" : undefined,
    placeholder,
    options,
    onClear: onChange,
    onChange: onChange,
  };

  return (
    <Form.Item {...props.formItemProps}>
      <Ca {..._props}></Ca>
    </Form.Item>
  );
}

export default Cascader;
