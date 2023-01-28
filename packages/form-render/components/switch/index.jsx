import { Form, Switch as Sw } from "antd";

function Switch(props) {
  const _swProps = {
    checked: props.data === props.field.activeValue || props.data === true,
    onChange: props.onChange,
  };
  return (
    <Form.Item {...props.formItemProps}>
      <Sw {..._swProps}></Sw>
    </Form.Item>
  );
}

export default Switch;
