import { useEffect, useState } from "react";
import { axios } from "@packages/data-model";

import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { imgToBase64 } from "../../common/img";

function Uploader(props) {
  const { field = {} } = props;
  const [fileList, setFileList] = useState([]);
  const onChange = (info) => {
    let _d = [...info.fileList];
    if (!field.multiple && _d.length > 0) {
      _d = _d[0];
    }
    props.onChange && props.onChange(_d);
  };

  useEffect(() => {
    let _d = props.data;
    if (_d && !Array.isArray(_d)) {
      _d = [_d];
    }
    if (JSON.stringify(_d) !== JSON.stringify(fileList)) {
      setFileList(_d || []);
    }
  }, [props.data]);

  const _props = {
    headers: field.headers,
    action: field.action,
    name: field.uploadName,
    data: field.uploadData,
    customRequest:
      field.customRequest || (field.action && field.uploadType === "base64")
        ? ({
            action,
            data,
            file,
            filename,
            headers,
            method,
            onSuccess,
            onProgress,
            onError,
          }) => {
            imgToBase64(file).then((base64File) => {
              axios({
                method: method || "post",
                url: action,
                data: {
                  ...data,
                  [filename]: base64File,
                },
                headers,
              })
                .then((res) => {
                  fileList?.forEach((it) => {
                    if (it.uid === file.uid) {
                      it.fileUrl = res?.data?.data?.url;
                    }
                  });
                  onSuccess(res?.data?.data?.url);
                })
                .catch(onError);
            });
          }
        : undefined,
    onChange: onChange,
    multiple: field.multiple,
    accept: field.accept,
    beforeUpload: (file) => {
      let list = [...fileList, file];
      if (!field.multiple) {
        list = [file];
      }
      setFileList(list);
      if (field.action) {
        return Promise.resolve(file);
      }
      return false;
    },
    maxCount: !field.multiple ? 1 : field.maxCount,
  };

  return (
    <div>
      <Upload {..._props} fileList={fileList}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </div>
  );
}

export default Uploader;
