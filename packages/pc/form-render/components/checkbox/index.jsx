import { useEffect, useState } from "react";
import { Form, Checkbox as Cb } from "antd";

import { getRemoteData } from "../../common/remote-data";

const FormItem = Form.Item;

const CheckboxGroup = Cb.Group;

function Checkbox(props) {
  const {
    scenario,
    formItemProps = {},
    field = { options },
    data,
    config,
  } = props;
  const [_options, setOptions] = useState(field.options || []);

  useEffect(() => {
    if (field.options) {
      setOptions(field.options);
    }
  }, [field.options]);

  // 处理远程数据的逻辑
  useEffect(() => {
    if (!field.isRemote) {
      return;
    }
    getRemoteData(field, config, scenario).then((list) => {
      setOptions(list);
    });
  }, [field.isRemote]);

  const _props = {
    id: field.name,
    value: data,
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    onChange: props.onChange,
    fieldNames: {
      label: field?.remoteConf?.labelKey || "label",
      value: field?.remoteConf?.valueKey || "value",
      children: field?.remoteConf?.childrenKey || "children",
    },
  };

  return (
    <FormItem {...formItemProps}>
      <CheckboxGroup {..._props}>
        {_options?.map((it) => (
          <Cb
            key={it[_props.fieldNames.value]}
            value={it[_props.fieldNames.value]}
          >
            {it[_props.fieldNames.label]}
          </Cb>
        ))}
      </CheckboxGroup>
    </FormItem>
  );
}

export default Checkbox;
