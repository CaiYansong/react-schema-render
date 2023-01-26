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
    slots = {},
    onChange,
  } = props || {};

  const { name } = field;

  const Com = slots[field.slotName];

  const _props = {
    name,
    data,
    scenario,
    formInstance,
    onChange,
  };

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
