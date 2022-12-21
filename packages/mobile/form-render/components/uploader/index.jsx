import { Form } from "antd-mobile";

import Uploader from "./uploader";

function UploaderCom(props) {
  const { name, formItemProps, formInstance, fieldConf, onChange } = props;

  function onUploadChange(files) {
    formInstance?.setFieldValue(name, files);
    onChange &&
      onChange({ [name]: files }, formInstance.getFieldsValue(true), props);
  }

  const _props = {
    ...props,
  };

  // 兼容 schema-editor 没有该配置的问题，后续移除
  if (fieldConf && fieldConf.mode && !_props.mode) {
    _props.mode = fieldConf.mode;
  }

  return (
    <Form.Item {...formItemProps}>
      <Uploader {..._props} onChange={onUploadChange} />
    </Form.Item>
  );
}

export default UploaderCom;
