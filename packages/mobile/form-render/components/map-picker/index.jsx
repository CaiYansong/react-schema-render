import { useState } from "react";
import { Form, Button, Popup } from "antd-mobile";

import LocationPicker from "./location-picker";
import LinePicker from "./line-picker";

function LocationPickerCom(props) {
  const {
    name,
    formItemProps,
    formInstance,
    onChange,
    data = {},
    disabled,
    readOnly,
    mode,
  } = props;

  const [visible, setVisible] = useState(false);
  const [_data, setData] = useState({});

  function onLocationChange(res) {
    formInstance?.setFieldValue(name, res);
    setData(res);
    onChange &&
      onChange({ [name]: res }, formInstance.getFieldsValue(true), props);
    onCancel();
  }

  function onCancel() {
    setVisible(false);
  }

  return (
    <Form.Item {...formItemProps}>
      {mode === "line" ? (
        // TODO: 展示逻辑优化
        <div>
          <div>
            起点：{_data.start && _data.start.lng},{" "}
            {_data.start && _data.start.lat}
          </div>
          <div>
            终点：{_data.end && _data.end.lng}, {_data.end && _data.end.lat}
          </div>
        </div>
      ) : (
        <span>
          经度：{_data.lng || data.lng}
          &nbsp; 纬度：{_data.lat || data.lat}
          &nbsp;
        </span>
      )}
      {disabled || readOnly ? null : (
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          地图选点
        </Button>
      )}
      <Popup
        visible={visible}
        onMaskClick={onCancel}
        bodyStyle={{ height: "80vh" }}
      >
        {mode === "line" ? (
          <LinePicker
            data={props.data}
            onConfirm={onLocationChange}
            onCancel={onCancel}
          />
        ) : (
          <LocationPicker
            data={props.data}
            onConfirm={onLocationChange}
            onCancel={onCancel}
          />
        )}
      </Popup>
    </Form.Item>
  );
}

export default LocationPickerCom;
