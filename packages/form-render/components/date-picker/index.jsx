import { Form, DatePicker as DP } from "antd";

const { RangePicker } = DP;

const rangeModeList = [
  "datetimerange",
  "daterange",
  "weekrange",
  "monthrange",
  "yearrange",
];

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
  };

  if (rangeModeList.includes(field.mode)) {
    return (
      <Form.Item {...formItemProps}>
        <RangePicker {..._dpProps} />
      </Form.Item>
    );
  }

  function onOk() {}
  return (
    <Form.Item {...formItemProps}>
      <DP {..._dpProps} />
    </Form.Item>
  );
}

export default DatePicker;
