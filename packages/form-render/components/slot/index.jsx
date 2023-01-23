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

  const Com = slots[field.name];
  if (Com) {
    const _props = {
      name,
      data,
      scenario,
      formInstance,
      onChange,
    };
    return <Com {..._props} />;
  }

  return (
    <Form.Item {...formItemProps}>
      {React.Children.map(children, function (childItem) {
        return React.cloneElement(childItem, {
          name,
          data,
          scenario,
          formInstance,
          onChange,
        });
      })}
    </Form.Item>
  );
}

export default Slot;
