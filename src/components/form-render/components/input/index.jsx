import React from 'react';
import { Input } from 'antd';

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
    onChange,
    onPressEnter,
    readonly,
    placeholder = '请输入',
  } = props;

  const _props = {
    allowClear: clearable,
    disabled: disabled,
    id: name,
    maxLength: wordLimit ? maxLength || 50 : undefined,
    showCount: wordLimit,
    type: mode,
    value: data,
    onChange: onChange,
    onPressEnter: onPressEnter,
    readOnly: readonly,
    placeholder: placeholder,
  };

  if (mode === 'textarea') {
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
