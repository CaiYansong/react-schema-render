import React from "react";
import { Form } from "antd";

function Slot(props) {
  const {
    formItemProps = {},
    field = {},
    children,
    data,
    scenario,
    formInstance,
    Slots = {},
    onChange,
  } = props || {};

  const { name } = field;

  const Com = Slots[field.slotName];

  const _props = {
    name,
    data,
    scenario,
    formInstance,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    onChange,
    setValue,
  };

  function setValue(value) {
    formInstance.setFieldValue(name, value);
  }

  if (Com) {
    return (
      <Form.Item {...formItemProps}>
        <Com {..._props} />
      </Form.Item>
    );
  }

  return (
    <Form.Item {...formItemProps}>
      {React.Children.map(children, function (childItem) {
        return React.cloneElement(childItem, _props);
      })}
    </Form.Item>
  );
}

export default Slot;
