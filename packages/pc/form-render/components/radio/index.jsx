import { Form, Radio as Ra } from "antd";

const FormItem = Form.Item;

function Radio(props) {
  const { formItemProps = {}, field = { options }, data } = props;

  const _props = {
    id: field.name,
    value: data,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    onChange: props.onChange,
  };

  return (
    <FormItem {...formItemProps}>
      <Ra.Group {..._props}>
        {field.options?.map((it) => (
          <Ra value={it.value}>{it.label}</Ra>
        ))}
      </Ra.Group>
    </FormItem>
  );
}

export default Radio;
