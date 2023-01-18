import React from "react";
import { Input } from "antd";

const { TextArea } = Input;

function InputCom(props) {
  const {
    clearable,
    disabled,
    name,
    maxLength,
    wordLimit,
    mode,
    data,
    readonly,
    placeholder = "请输入",
    onPressEnter,
    fieldSubmit,
  } = props;

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
    disabled: disabled,
    id: name,
    maxLength: wordLimit ? maxLength || 50 : undefined,
    showCount: wordLimit,
    type: mode,
    value: data,
    readOnly: readonly,
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
    return <TextArea {...textareaProps} />;
  }

  const { prepend, append } = props;
  const inputProps = {
    ..._props,
    addonAfter: prepend,
    addonBefore: append,
  };

  return <Input {...inputProps} />;
}

export default InputCom;
