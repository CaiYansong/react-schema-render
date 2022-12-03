import { useState, useEffect, useRef } from 'react';
import { Form } from 'antd';

import Input from './components/input';

const TypeEnum = {
  input: Input,
};

export default function FormRender({
  name,
  layout,
  initialValues,
  scenario,
  schema = {},
  data = {},
  config = {},
  fieldSubmit = () => {},
  onChange = () => {},
}) {
  const {
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
  } = schema;

  const [form] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    onChange && onChange(changedValues, allValues, form);
    console.log('onValueChange', changedValues, allValues);
  }

  return (
    <Form
      className="form-render"
      name={name}
      form={form}
      layout={layout}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={initialValues || data}
      onValuesChange={onValueChange}
    >
      {fieldList?.map((it) => {
        const { type, name } = it;
        const rules = validRules[name];

        const Component = TypeEnum[type];

        return (
          <Form.Item
            key={it.name}
            label={it.label}
            name={it.name}
            rules={rules}
          >
            {Component ? (
              <Component
                {...it}
                scenario={scenario}
                config={config}
                data={data[name]}
              />
            ) : (
              '—'
            )}
          </Form.Item>
        );
      })}
    </Form>
  );
}
