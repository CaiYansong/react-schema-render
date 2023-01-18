import { useImperativeHandle, forwardRef, useEffect } from "react";
import { Form } from "antd";

import FormItems from "./form-items";

import "./index.less";

function FormRender(props, parentRef) {
  const {
    name,
    inline,
    initialValues,
    schema = {},
    data = {},
    fieldSubmit = () => {},
    submitRender,
    onChange = () => {},
    onFinish = () => {},
    onFinishFailed = () => {},
  } = props;

  const { formConf = {} } = schema;

  const [formInstance] = Form.useForm();

  useImperativeHandle(parentRef, () => ({
    formInstance,
  }));

  // 数据回填
  useEffect(() => {
    if (
      data &&
      JSON.stringify(data) !== JSON.stringify(formInstance.getFieldsValue(true))
    ) {
      const fields = [];
      Object.keys(data).forEach((key) => {
        fields.push({ name: key, value: data[key] });
      });
      formInstance.setFields(fields);
    } else if (!data || Object.keys(data).length === 0) {
      formInstance.resetFields([]);
    }
  }, [data]);

  function onValueChange(changedValues, allValues) {
    onChange && onChange(changedValues, allValues, formInstance);
  }

  let layout = undefined;
  if (inline) {
    layout = "inline";
  }

  const { labelPosition, labelWidth } = formConf || {};

  if (labelPosition === "top") {
    layout = "vertical";
  }

  const labelCol = {};

  // 带单位的为 style.width 的值
  if (typeof labelWidth === "string" && labelWidth != +labelWidth) {
    if (!labelCol.style) {
      labelCol.style = {};
    }
    labelCol.style.width = labelWidth;
  } else if (typeof labelWidth === "number" || labelWidth == +labelWidth) {
    labelCol.span = labelWidth;
  }

  function onItemChange(...args) {
    // console.log("onItemChange", ...args);
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
      <FormItems
        {...{
          data,
          disabled: props.disabled,
          readOnly: props.readOnly,
          scenario: props.scenario,
          schema,
          slots: props.slots,
          formInstance,
          config: props.config,
          fieldsConf: props.fieldsConf || {},
          onChange: onItemChange,
          fieldSubmit,
        }}
      />

      {submitRender ? (
        typeof submitRender === "function" ? (
          <Form.Item>{submitRender()}</Form.Item>
        ) : (
          submitRender
        )
      ) : null}
    </Form>
  );
}

export default forwardRef(FormRender);
