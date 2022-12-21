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
          value: data,
          scenario,
          formInstance,
          ...props,
          onChange: (value) => {
            formInstance?.setFieldValue(name, value);
            onChange &&
              onChange(
                { [name]: value },
                formInstance.getFieldsValue(true),
                props,
              );
          },
        });
      })}
    </FormItem>
  );
}

export default Slot;
