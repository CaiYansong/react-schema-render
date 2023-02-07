import { useEffect, useImperativeHandle, forwardRef } from "react";
import { Form } from "antd-mobile";
import _ from "lodash";

import FormItems from "./form-items";

import { handleFillBackData, handleSubmitData } from "./adapter/data-adapter";

import "./index.less";

function FormRender(props, parentRef) {
  const {
    name = Date.now(),
    inline,
    layout = "horizontal",
    initialValues,
    scenario,
    schema = {},
    data = {},
    disabled,
    readOnly,
    config = {},
    onChange,
    onFinish,
    onFinishFailed,
    fieldsConf = {},
  } = props || {};

  const [formInstance] = Form.useForm();

  useImperativeHandle(parentRef, () => ({
    formInstance,
    validateFields: formInstance.validateFields,
  }));

  useEffect(() => {
    formInstance.setFieldsValue(data);
  }, [data]);

  function onValueChange(changedValues, allValues) {
    // TODO: 确认初始数据是否需要全部回填，非表单项数据会被清除
    onChange &&
      onChange(
        changedValues,
        handleSubmitData(schema.fieldList, _.cloneDeep(allValues)),
        formInstance,
      );
  }

  let _layout = layout;
  if (inline) {
    _layout = "inline";
  }

  const { labelPosition, labelWidth } = schema?.formConf || {};

  if (labelPosition === "top") {
    _layout = "vertical";
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

  return (
    <Form
      className={`form-render ${readOnly ? "form-render-readonly" : ""} ${
        disabled ? "form-render-disabled" : ""
      }`}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      form={formInstance}
      initialValues={handleFillBackData(
        schema.fieldList,
        initialValues || data,
      )}
      layout={_layout}
      // labelCol={labelCol}
      // labelAlign={schema?.formConf?.labelPosition}
      onValuesChange={onValueChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <FormItems
        disabled={disabled}
        readOnly={readOnly}
        data={data}
        scenario={scenario}
        schema={schema}
        config={config}
        formInstance={formInstance}
        fieldsConf={fieldsConf}
        onChange={onValueChange}
      >
        {props.children}
      </FormItems>
    </Form>
  );
}

export default forwardRef(FormRender);
