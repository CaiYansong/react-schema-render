import {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Form } from "antd";
import _ from "lodash";

import {
  handelBackData,
  getFormatData,
  getSubmitFormData,
} from "./common/data-handler";
import FormItems from "./form-items";

import "./index.less";

const watchEnum = {};

function FormRender(props, parentRef) {
  const {
    name,
    inline,
    initialValues,
    schema = {},
    data,
    fieldSubmit = () => {},
    submitRender,
    onChange = () => {},
    onFinish = () => {},
    onFinishFailed = () => {},
  } = props;

  const _schema = useMemo(() => _.cloneDeep(schema), [schema]);

  const { formConf = {} } = _schema;

  const [formInstance] = Form.useForm();

  useImperativeHandle(parentRef, () => ({
    formInstance,
    validate: formInstance.validateFields,
    setData,
    getFormatData(_val) {
      return getFormatData(_val || data || {}, _schema.fieldList);
    },
    getSubmitFormData(_val) {
      return getSubmitFormData(
        getFormatData(_val || data || {}, _schema.fieldList),
        _schema,
      );
    },
  }));

  function setData(data) {
    if (!data || Object.keys(data).length === 0) {
      formInstance.resetFields();
    } else if (data) {
      formInstance.resetFields();
      const fields = [];
      Object.keys(data).forEach((key) => {
        fields.push({ name: key, value: data[key] });
      });
      formInstance.setFields(fields);
    }
  }

  // 数据回填
  useEffect(() => {
    if (data) {
      setData(handelBackData(data, _schema.fieldList));
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
  if (
    (typeof labelWidth === "string" && labelWidth != +labelWidth) ||
    labelWidth === undefined
  ) {
    if (!labelCol.style) {
      labelCol.style = {};
    }
    labelCol.style.width = labelWidth || "80px";
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
      initialValues={handelBackData(initialValues || data, _schema.fieldList)}
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
          data: data || {},
          disabled: props.disabled,
          readOnly: props.readOnly,
          scenario: props.scenario,
          schema: _schema,
          Slots: props.Slots,
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
