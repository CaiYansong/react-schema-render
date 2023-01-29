import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

function InputCom(props) {
  const {
    formItemProps = {},
    field = {},
    data,
    onPressEnter,
    fieldSubmit,
  } = props;

  const {
    name,
    placeholder = "请输入",
    clearable,
    disabled,
    readonly,
    maxLength,
    wordLimit,
    mode,
  } = field;

  function onChange(e) {
    const { value } = e.target;
    props.onChange && props.onChange(value);
    // clear 事件
    if (!value && e.type === "click") {
      props.fieldSubmit && props.fieldSubmit(e);
    }
  }

  const _props = {
    allowClear: clearable,
    id: name,
    maxLength: wordLimit ? maxLength || 50 : undefined,
    showCount: wordLimit,
    type: mode,
    value: data,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    placeholder,
    onChange: onChange,
    onPressEnter: (e) => {
      fieldSubmit && fieldSubmit(e);
      onPressEnter && onPressEnter(e);
    },
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
      <Form.Item {...formItemProps}>
        <TextArea {...textareaProps} />
      </Form.Item>
    );
  }

  const { prepend, append } = props;
  const inputProps = {
    ..._props,
    addonAfter: prepend,
    addonBefore: append,
  };

  return (
    <Form.Item {...formItemProps}>
      <Input {...inputProps} />
    </Form.Item>
  );
}

export default InputCom;
