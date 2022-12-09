import React from "react";
import { Form } from "antd-mobile";

const FormItem = Form.Item;

function Slot(props) {
  const {
    children,
    name,
    data,
    scenario,
    formInstance,
    onChange,
    formItemProps = {},
  } = props || {};
  return (
    <FormItem {...formItemProps}>
      {React.Children.map(children, function (childItem) {
        return React.cloneElement(childItem, {
          name,
          data,
          scenario,
          formInstance,
          onChange: (value) => {
            onChange && onChange({ [name]: value }, props);
          },
        });
      })}
    </FormItem>
  );
}

export default Slot;
