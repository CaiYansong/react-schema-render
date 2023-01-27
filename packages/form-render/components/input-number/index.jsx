import { Form, InputNumber as IN } from "antd";

function InputNumber(props) {
  const { field = {} } = props;

  const _props = {
    min: field.min,
    max: field.max,
    step: field.step,
    precision: field.precision,
    onChange: props.onChange,
  };
  // "stepOnly": true,

  return (
    <Form.Item {...props.formItemProps}>
      <IN {..._props} />
    </Form.Item>
  );
}

export default InputNumber;
