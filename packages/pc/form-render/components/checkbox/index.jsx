import { useEffect } from "react";
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
  };

  return (
    <FormItem {...formItemProps}>
      <CheckboxGroup {..._props}>
        {field.options?.map((it) => (
          <Cb key={it.value} value={it.value}>
            {it.label}
          </Cb>
        ))}
      </CheckboxGroup>
    </FormItem>
  );
}

export default Checkbox;
