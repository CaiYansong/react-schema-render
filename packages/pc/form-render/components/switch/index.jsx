import { Form, Switch as Sw } from "antd";

function Switch(props) {
  const { field = {} } = props;
  const _swProps = {
    checked: props.data === props.field.activeValue || props.data === true,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    onChange: props.onChange,
    checkedChildren: field.activeText,
    unCheckedChildren: field.inactiveText,
    // activeValue: "open-val",
    // inactiveValue: "close-val",
  };

  return (
    <Form.Item {...props.formItemProps}>
      <Sw {..._swProps}></Sw>
    </Form.Item>
  );
}

export default Switch;
