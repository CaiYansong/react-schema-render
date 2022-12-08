import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Dialog,
  Checkbox,
  Space,
  DatePicker,
  Picker,
} from "antd-mobile";
import { FormInstance } from "antd-mobile/es/components/form";
import dayjs from "dayjs";
import { CloseCircleFill } from "antd-mobile-icons";

export default () => {
  const [form] = Form.useForm();
  const onSubmit = () => {
    const values = form.getFieldsValue();
    Dialog.alert({
      content: <pre>{JSON.stringify(values, null, 2)}</pre>,
    });
  };

  const [pickerVisible, setPickerVisible] = useState(false);
  function onValuesChange(changedValues, allValues) {
    console.log("onValuesChange", changedValues, allValues);
  }
  return (
    <>
      <Form
        onValuesChange={onValuesChange}
        form={form}
        initialValues={{
          a: "aaa",
          b: [],
        }}
        footer={
          <Button block color="primary" onClick={onSubmit} size="large">
            提交
          </Button>
        }
      >
        <Form.Item
          label="表单联动-字段B"
          shouldUpdate={(prevValues, curValues) => {
            return prevValues.b !== curValues.b;
          }}
        >
          {({ getFieldValue }) => {
            return JSON.stringify(getFieldValue("b"));
          }}
        </Form.Item>
        <Form.Item
          label="表单联动-字段B"
          name="birthday1"
          shouldUpdate={(prevValues, curValues) => {
            return prevValues.b !== curValues.b;
          }}
          onClick={() => {
            setPickerVisible(true);
          }}
        >
          <Picker
            columns={[
              [
                { label: "周一", value: "Mon" },
                { label: "周二", value: "Tues" },
                { label: "周三", value: "Wed" },
                { label: "周四", value: "Thur" },
                { label: "周五", value: "Fri" },
              ],
            ]}
            visible={pickerVisible}
            onClose={() => {
              setPickerVisible(false);
            }}
          >
            {(value) => (value && value[0] ? value[0].label : "请选择日期")}
          </Picker>
        </Form.Item>
        <DatePickerInputItem />
      </Form>
    </>
  );
};

const DatePickerInputItem = () => {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, curValues) =>
        prevValues.birthday !== curValues.birthday
      }
    >
      <Form.Item
        name="birthday"
        label="时间选择器"
        trigger="onConfirm"
        onClick={() => {
          setPickerVisible(true);
        }}
      >
        <DatePicker
          visible={pickerVisible}
          onClose={() => {
            setPickerVisible(false);
          }}
        >
          {(value) =>
            value ? dayjs(value).format("YYYY-MM-DD") : "请选择日期"
          }
        </DatePicker>
      </Form.Item>
    </Form.Item>
  );
};
