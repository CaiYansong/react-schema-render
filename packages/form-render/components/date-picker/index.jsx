import { DatePicker as DP } from "antd";

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
  const { field = {} } = props;
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
    return <RangePicker {..._dpProps} />;
  }

  function onOk() {}
  return <DP {..._dpProps} />;
}

export default DatePicker;
