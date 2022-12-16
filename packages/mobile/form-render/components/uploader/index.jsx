import { Form } from "antd-mobile";

import Uploader from "./uploader";

function UploaderCom(props) {
  const { name, formItemProps, formInstance, fieldsConf, onChange } = props;

  function onUploadChange(files) {
    formInstance?.setFieldValue(name, files);
    onChange &&
      onChange({ [name]: files }, formInstance.getFieldsValue(true), props);
  }

  const _props = {
    ...props,
  };

  // 兼容 schema-editor 没有该配置的问题，后续移除
  if (fieldsConf && fieldsConf[name] && fieldsConf[name].mode && !_props.mode) {
    _props.mode = fieldsConf[name].mode;
  }

  return (
    <Form.Item {...formItemProps}>
      <Uploader {..._props} onChange={onUploadChange} />
    </Form.Item>
  );
}

export default UploaderCom;
