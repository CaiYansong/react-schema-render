import { useState, useEffect } from "react";
import { Form, Picker } from "antd-mobile";

import { getRemoteData } from "../../common/remote-data";

const FormItem = Form.Item;

function SelectCom(props) {
  const {
    parentField,
    name,
    data,
    clearable,
    disabled,
    readOnly,
    multiple,
    searchable,
    placeholder = "请选择",
    options,
    formInstance,
    formItemProps = {},
    onChange,
  } = props;
  const [_options, setOptions] = useState(options ? [options] : []);

  // 处理远程数据源
  useEffect(() => {
    if (!props.isRemote) {
      return;
    }
    getRemoteData(props, props.config, props.scenario).then((options) => {
      setOptions([options]);
    });
  }, [props, props.isRemote]);

  const [visible, setVisible] = useState(false);

  function onClose() {
    setVisible(false);
  }

  function onClick() {
    if (readOnly || disabled) {
      return;
    }
    setVisible((val) => {
      return !val;
    });
  }

  const _formItemProps = {
    ...formItemProps,
    trigger: "onConfirm",
  };

  return (
    <FormItem {..._formItemProps} onClick={onClick}>
      {readOnly || disabled ? null : (
        <Picker columns={_options} visible={visible} onClose={onClose}>
          {(value) =>
            value && value.length > 0 ? value[0]?.label : placeholder
          }
        </Picker>
      )}
    </FormItem>
  );
}

export default SelectCom;
