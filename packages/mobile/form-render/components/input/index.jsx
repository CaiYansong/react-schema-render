import React from 'react';
import { Input, TextArea } from 'antd-mobile';

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
    placeholder = '请输入',
    onChange,
    onClear,
    onPressEnter,
  } = props;

  const _props = {
    clearable,
    disabled: disabled,
    id: name,
    maxLength: wordLimit ? maxLength || 50 : undefined,
    showCount: wordLimit,
    type: mode,
    value: data,
    readOnly: readonly,
    placeholder,
    onChange: onChange,
    onClear: onClear,
    onEnterPress: onPressEnter,
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

  return <Input {..._props} />;
}

export default InputCom;
