import { useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { Form } from "antd";
import _ from "lodash";

import { cleanData, handelBackData, getFormatData } from "./common/utils";
import FormItems from "./form-items";

import "./index.less";

const watchEnum = {};

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
    validate: formInstance.validateFields,
    setData,
    getSubmitData(_val) {
      return getFormatData(_val || data, schema.fieldList);
    },
  }));

  function setData(data) {
    if (data) {
      const fields = [];
      Object.keys(data).forEach((key) => {
        fields.push({ name: key, value: data[key] });
      });
      formInstance.setFields(fields);
    } else if (!data || Object.keys(data).length === 0) {
      formInstance.resetFields();
    }
  }

  // 数据回填
  useEffect(() => {
    let _data = handelBackData(data, schema.fieldList);
    // console.log('_data', _data);

    // TODO: 回填逻辑优化
    if (
      JSON.stringify(cleanData(_.cloneDeep(_data))) !==
      JSON.stringify(cleanData(_.cloneDeep(formInstance.getFieldsValue(true))))
    ) {
      setData(cleanData(_.cloneDeep(_data)));
    }
  }, [data]);

  function onValueChange(changedValues, allValues) {
    let key = Object.keys(changedValues);
    key = key.length === 1 && key[0];
    if (key && Array.isArray(watchEnum[key])) {
      watchEnum[key].forEach((watchFn) => {
        watchFn(changedValues[key]);
      });
    }
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
      // initialValues={handelBackData(initialValues || data, schema.fieldList)}
      layout={layout}
      labelCol={labelCol}
      labelAlign={formConf.labelPosition}
      disabled={props.disabled}
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
          watchEnum,
        }}
      />

      {submitRender ? (
        typeof submitRender === "function" ? (
          <Form.Item key="submit">{submitRender()}</Form.Item>
        ) : (
          submitRender
        )
      ) : null}
    </Form>
  );
}

export default forwardRef(FormRender);
