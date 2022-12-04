import { Form } from 'antd';

import rulesAdapter from './adapter/rules-adapter';

import Input from './components/input';
import Select from './components/select';
import Slot from './components/slot';

const TypeEnum = {
  input: Input,
  select: Select,
  slot: Slot,
};

export default function FormRender({
  name,
  inline,
  initialValues,
  scenario,
  schema = {},
  data = {},
  config = {},
  fieldSubmit = () => {},
  onChange = () => {},
  onFinish = () => {},
  onFinishFailed = () => {},
  children,
}) {
  const {
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
  } = schema;

  const [formInstance] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    onChange && onChange(changedValues, allValues, formInstance);
    console.log('onValueChange', changedValues, allValues);
  }

  let layout = undefined;
  if (inline) {
    layout = 'inline';
  }

  const { labelPosition, labelWidth, marginY, marginX } = formConf || {};

  if (labelPosition === 'top') {
    layout = 'vertical';
  }

  const labelCol = {};

  // 带单位的为 style.width 的值
  if (typeof labelWidth === 'string' && labelWidth != +labelWidth) {
    if (!labelCol.style) {
      labelCol.style = {};
    }
    labelCol.style.width = labelWidth;
  } else if (typeof labelWidth === 'number' || labelWidth == +labelWidth) {
    labelCol.span = labelWidth;
  }

  function onItemChange(...args) {
    console.log('onItemChange', ...args);
  }

  return (
    <Form
      className="form-render"
      name={name}
      form={formInstance}
      initialValues={initialValues || data}
      layout={layout}
      labelCol={labelCol}
      labelAlign={formConf.labelPosition}
      onValuesChange={onValueChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {fieldList?.map((it) => {
        // TODO: activator visible
        const { type, name } = it;
        const rules = rulesAdapter(validRules[name], validFuncs);

        const Component = TypeEnum[type];

        return (
          <Form.Item
            key={it.name}
            label={it.label}
            name={it.name}
            rules={rules}
            wrapperCol={{ span: it.span }}
            style={{
              marginBottom: `${marginY || 24}px`,
              marginRight: `${marginX || 16}px`,
            }}
          >
            {Component ? (
              <Component
                {...it}
                scenario={scenario}
                config={config}
                data={data[name]}
                formInstance={formInstance}
                onChange={onItemChange}
              >
                {type === 'slot' &&
                  children?.find((child) => child.key === it.slotName)}
              </Component>
            ) : (
              '—'
            )}
          </Form.Item>
        );
      })}
    </Form>
  );
}
