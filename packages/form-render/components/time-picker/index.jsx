import { Form, TimePicker as TP } from "antd";
import dayjs from "dayjs";

function TimePicker(props) {
  const { formItemProps = {}, field = {}, onChange } = props;

  const _dpProps = {
    onChange: onChange,
  };

  if (field.mode === "timerange") {
    if (Array.isArray(props.data)) {
      const val = [];
      props.data.forEach((it, i) => {
        val[i] = dayjs(it);
      });
      _dpProps.value = val;
    }

    return (
      <Form.Item {...formItemProps}>
        <TP.RangePicker {..._dpProps}></TP.RangePicker>
      </Form.Item>
    );
  }

  if (props.data) {
    _dpProps.value = dayjs(props.data);
  }

  return (
    <Form.Item {...formItemProps}>
      <TP {..._dpProps}></TP>
    </Form.Item>
  );
}

export default TimePicker;
