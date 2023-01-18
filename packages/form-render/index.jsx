import { useImperativeHandle, forwardRef, useEffect } from "react";
import { Form } from "antd";

import rulesAdapter from "./adapter/rules-adapter";

import Input from "./components/input";
import Select from "./components/select";
import DatePicker from "./components/date-picker";
import Uploader from "./components/uploader";
import ItemList from "./components/item-list";
import Slot from "./components/slot";

import "./index.less";

const TypeEnum = {
  input: Input,
  select: Select,
  "date-picker": DatePicker,
  "input-file": Uploader,
  "item-list": ItemList,
  slot: Slot,
};

function FormRender(
  {
    name,
    inline,
    initialValues,
    scenario,
    schema = {},
    data = {},
    config = {},
    slots,
    fieldSubmit = () => {},
    submitRender,
    onChange = () => {},
    onFinish = () => {},
    onFinishFailed = () => {},
    children,
  },
  parentRef,
) {
  const {
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
  } = schema;

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

  const { labelPosition, labelWidth, marginY, marginX } = formConf || {};

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
      {fieldList?.map((it) => {
        if (it.activated === false) {
          return null;
        }
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
              display: it.visible === false ? "none" : undefined,
              marginBottom: `${marginY || 24}px`,
              marginRight: `${marginX || 16}px`,
            }}
          >
            {Component ? (
              <Component
                {...it}
                field={it}
                scenario={scenario}
                config={config}
                data={data[name]}
                formInstance={formInstance}
                onChange={onItemChange}
                fieldSubmit={fieldSubmit}
              >
                {type === "slot" &&
                  slots?.find((slot) => slot.key === it.slotName)}
              </Component>
            ) : (
              "—"
            )}
          </Form.Item>
        );
      })}
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
