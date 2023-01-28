import { Form, Switch as Sw } from "antd";

function Switch(props) {
  return (
    <Form.Item {...props.formItemProps}>
      <Sw></Sw>
    </Form.Item>
  );
}

export default Switch;
