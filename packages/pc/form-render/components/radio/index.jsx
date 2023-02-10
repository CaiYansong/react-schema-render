import { Form, Radio as Ra } from "antd";

const FormItem = Form.Item;

function Radio(props) {
  const { formItemProps = {}, field = { options } } = props;
  return (
    <FormItem {...formItemProps}>
      <Ra.Group onChange={props.onChange} value={props.data}>
        {field.options?.map((it) => (
          <Ra value={it.value}>{it.label}</Ra>
        ))}
      </Ra.Group>
    </FormItem>
  );
}

export default Radio;
