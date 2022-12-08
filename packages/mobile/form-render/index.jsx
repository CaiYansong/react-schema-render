import { Form } from 'antd-mobile';

import FormItems from './form-items';

import { handleFillBackData, handleSubmitData } from './adapter/data-adapter';

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
    console.log(
      'onValueChange',
      allValues,
      handleSubmitData(schema.fieldList, allValues),
    );
    onChange &&
      onChange(
        changedValues,
        handleSubmitData(schema.fieldList, allValues),
        formInstance,
      );
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
      initialValues={handleFillBackData(
        schema.fieldList,
        initialValues || data,
      )}
      layout={layout}
      // labelCol={labelCol}
      // labelAlign={schema?.formConf?.labelPosition}
      onValuesChange={onValueChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <FormItems
        data={data}
        scenario={scenario}
        schema={schema}
        config={config}
        formInstance={formInstance}
        onChange={onValueChange}
      >
        {props.children}
      </FormItems>
    </Form>
  );
}
