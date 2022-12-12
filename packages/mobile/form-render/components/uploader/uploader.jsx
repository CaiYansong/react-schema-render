import { useState, useRef } from "react";
import { Image, Button, Dialog, ActionSheet } from "antd-mobile";

import { getImage, getVideo } from "./corodva-camera";

import "./uploader.less";

/**
 *  建立一个可以存取该 file 的 url
 * @param {Object} file 文件
 * @returns {string} url
 * blob:http://localhost:8000/c9950644-5118-4231-9be7-8183bde1fdc7
 */
function getFileURL(file) {
  let url = null;

  // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }

  return url;
}

function Uploader(props) {
  const { name, multiple, mode, onChange, accept } = props;
  const [fileList, setFileList] = useState([]);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  function onFileChange(e) {
    e.persist();
    const { files: rawFiles } = e.target;
    let files = [].slice.call(rawFiles);
    e.target.value = ""; // HACK: fix the same file doesn't trigger onChange
    handleChange(files);
  }

  function handleChange(files, type) {
    let _files = files;
    if (type !== "del" && multiple) {
      _files = [...fileList, ..._files];
    }
    setFileList(_files);
    onChange && onChange(_files && _files.length > 0 ? _files : undefined);
  }

  const uploaderRef = useRef();

  const actions = [
    { text: "选择文件", key: "select" },
    { text: "拍照", key: "captureImage" },
    { text: "录像", key: "captureVideo" },
  ];

  function onPciker({ key }) {
    switch (key) {
      case "select":
        uploaderRef.current.click();
        break;

      case "captureImage":
        getImage().then((res) => {
          handleChange([res]);
        });
        break;

      case "captureVideo":
        getVideo().then((res) => {
          handleChange([res]);
        });
        break;
    }
    setActionSheetVisible(false);
  }

  function onItemDel(idx) {
    Dialog.confirm({
      content: "确认删除？",
      onConfirm: () => {
        setFileList((files) => {
          files.splice(idx, 1);
          handleChange(files, "del");
          return files;
        });
      },
    });
  }

  function ItemRender(props) {
    const { index } = props;
    return (
      <div className="file-item">
        {props.children}
        <div
          className="file-item-del"
          onClick={() => {
            onItemDel(index);
          }}
        >
          X
        </div>
      </div>
    );
  }

  return (
    <div className="uploader">
      <input
        className="aria-hidden"
        style={{ display: "none" }}
        ref={uploaderRef}
        id={name}
        onChange={onFileChange}
        type="file"
        name={name}
        multiple={multiple}
        accept={accept}
      ></input>
      {fileList.map((it, idx) => {
        if (typeof it === "string" && it.startsWith("data:image/")) {
          return (
            <ItemRender key={name + idx} index={idx}>
              <Image className="file-item-view" src={it} alt={name} />
            </ItemRender>
          );
        }
        const { type, name } = it;
        if (type?.startsWith("image/")) {
          return (
            <ItemRender index={idx} key={name + idx}>
              <Image
                className="file-item-view"
                src={getFileURL(it)}
                alt={name}
              />
            </ItemRender>
          );
        }
        if (type?.startsWith("video/")) {
          return (
            <ItemRender index={idx} key={name + idx}>
              <video className="file-item-view" src={getFileURL(it)} controls />
            </ItemRender>
          );
        }
        return it.name;
      })}
      <Button
        onClick={() => {
          setActionSheetVisible(true);
        }}
      >
        +
      </Button>
      <ActionSheet
        cancelText="取消"
        visible={actionSheetVisible}
        actions={actions}
        onAction={onPciker}
        onClose={() => setActionSheetVisible(false)}
      />
    </div>
  );
}

export default Uploader;
