import { Form, DatePicker as DP } from "antd";
import dayjs from "dayjs";

import { rangeModeList } from "../../common/utils";

const { RangePicker } = DP;

const pickerEnum = {
  month: "month",
  week: "week",
  year: "year",
};

function DatePicker(props) {
  const { formItemProps = {}, field = {} } = props;
  function onChange(date, dateString) {
    props.onChange && props.onChange(date, dateString);
  }

  const _dpProps = {
    showTime: field.mode === "datetime" || field.mode === "datetimerange",
    onChange: onChange,
    onOk: onOk,
    picker: pickerEnum[field.mode],
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
  };

  if (rangeModeList.includes(field.mode)) {
    if (Array.isArray(props.data)) {
      const val = [];
      props.data.forEach((it, i) => {
        val[i] = dayjs(it);
      });
      _dpProps.value = val;
    }
    return (
      <Form.Item {...formItemProps}>
        <RangePicker {..._dpProps} />
      </Form.Item>
    );
  }

  if (props.data) {
    _dpProps.value = dayjs(props.data);
  }

  function onOk() {}
  return (
    <Form.Item {...formItemProps}>
      <DP {..._dpProps} />
    </Form.Item>
  );
}

export default DatePicker;
