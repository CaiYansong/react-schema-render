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
    onChange,
  } = props || {};

  const { name } = field;

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
