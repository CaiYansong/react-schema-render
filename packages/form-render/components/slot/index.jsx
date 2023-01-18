import React from "react";
import { Form } from "antd";

function Slot(props) {
  const {
    formItemProps = {},
    children,
    name,
    data,
    scenario,
    formInstance,
    onChange,
  } = props || {};
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
