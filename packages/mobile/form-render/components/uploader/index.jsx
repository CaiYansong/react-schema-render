import { Form, } from "antd-mobile";

import Uploader from "./uploader";

function UploaderCom(props) {
  const { name, formItemProps, formInstance, onChange } = props;

  function onUploadChange(files) {
    formInstance?.setFieldValue(name, files);
    onChange &&
      onChange({ [name]: files }, formInstance.getFieldsValue(true), props);
  }

  return (
    <Form.Item {...formItemProps}>
      <Uploader {...props} onChange={onUploadChange} />
    </Form.Item>
  );
}

export default UploaderCom;
