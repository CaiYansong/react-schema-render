import { Form } from 'antd';

import rulesAdapter from './adapter/rules-adapter';

import Input from './components/input';
import Select from './components/select';
import ItemList from './components/item-list';
import Slot from './components/slot';

const TypeEnum = {
  input: Input,
  'input-number': Input,
  select: Select,
  'item-list': ItemList,
  slot: Slot,
};

// 内置了 Form.Item 的组件
const insizeFormItemEnum = {
  select: true,
  'item-list': true,
};

import FormItems from './form-items';

export default function FormRender(props) {
  const {
    name = Date.now(),
    inline,
    initialValues,
    scenario,
    schema = {},
    data = {},
    config = {},
    fieldSubmit,
    onChange,
    onFinish,
    onFinishFailed,
  } = props || {};

  const [formInstance] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    onChange && onChange(changedValues, allValues, formInstance);
    console.log('onValueChange', allValues);
  }

  let layout = undefined;
  if (inline) {
    layout = 'inline';
  }

  const { labelPosition, labelWidth } = schema?.formConf || {};

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

  return (
    <Form
      className="form-render"
      name={name}
      form={formInstance}
      initialValues={initialValues || data}
      layout={layout}
      labelCol={labelCol}
      labelAlign={schema?.formConf?.labelPosition}
      onValuesChange={onValueChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <FormItems
        scenario={scenario}
        schema={schema}
        config={config}
        formInstance={formInstance}
      >
        {props.children}
      </FormItems>
    </Form>
  );
}
