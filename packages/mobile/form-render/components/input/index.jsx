import React from "react";
import { Form, Input, TextArea } from "antd-mobile";

const FormItem = Form.Item;

function InputCom(props) {
  const {
    clearable,
    disabled,
    name,
    maxLength,
    wordLimit,
    mode,
    data,
    readOnly,
    placeholder = "请输入",
    onClear,
    onPressEnter,
    formItemProps,
  } = props;

  let _props = {
    clearable,
    disabled: disabled,
    id: name,
    maxLength: wordLimit ? maxLength || 50 : undefined,
    showCount: wordLimit,
    type: mode,
    value: data,
    readOnly,
    placeholder,
    onClear: onClear,
    onEnterPress: onPressEnter,
  };

  if (mode === "textarea") {
    const { autosize, minRows, maxRows, onResize } = props;
    const textareaProps = {
      ..._props,
      autoSize: autosize && {
        minRows: minRows || 2,
        maxRows: maxRows || undefined,
      },
      onResize,
    };
    return (
      <FormItem {...formItemProps}>
        <TextArea {...textareaProps} />
      </FormItem>
    );
  }

  if (props.type === "input-number") {
    const { max, min } = props;

    _props = {
      ..._props,
      type: "number",
      max,
      min,
    };
  }

  return (
    <FormItem {...formItemProps}>
      <Input {..._props} />
    </FormItem>
  );
}

export default InputCom;
