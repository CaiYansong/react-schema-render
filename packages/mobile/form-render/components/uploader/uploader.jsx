import { useState, useRef, useEffect, useMemo } from "react";
import { Image, Button, Dialog, ActionSheet } from "antd-mobile";
import { CloseCircleFill } from "antd-mobile-icons";

import Video from "./video";

import { getImage, getVideo } from "./common/cordova-camera";
import { getFileURL, checkImageUrl, checkVideoUrl } from "./common/utils";

import "./uploader.less";

const TYPE_VIDEO = "video";
const TYPE_IMG = "img";

const _ = require("lodash");

function Uploader(props) {
  const {
    name,
    multiple,
    // 模式字符串: all | select | image | video 或 数组 select | image | video 组合：如：['select', 'image']
    mode = "select",
    onChange,
    accept,
    disabled,
    readOnly,
    data,
  } = props;
  const [fileList, setFileList] = useState(data || []);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  useEffect(() => {
    setFileList(data || []);
  }, [data]);

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

  const actions = useMemo(() => {
    const allEnum = {
      select: { text: "选择文件", key: "select" },
      image: { text: "拍照", key: "captureImage" },
      video: { text: "录像", key: "captureVideo" },
    };
    if (Array.isArray(mode)) {
      return mode.filter((it) => !!allEnum[it]).map((it) => allEnum[it]);
    }
    if (mode === "all") {
      return Object.keys(allEnum).map((key) => allEnum[key]);
    }
    return allEnum[mode] ? [allEnum[mode]] : [allEnum.select];
  }, [mode]);

  function onPicker({ key }) {
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
        // setFileList((files) => {
        //   files.splice(idx, 1);
        //   handleChange(files, "del");
        //   return files;
        // });
        const middleValue = _.cloneDeep(fileList);
        middleValue.splice(idx, 1);
        handleChange(middleValue, "del");
        setFileList(middleValue);
      },
    });
  }

  function ItemRender(props) {
    const { index } = props;
    return (
      <div className="file-item">
        {props.children}
        {disabled || readOnly ? null : (
          <div
            className="file-item-del"
            onClick={() => {
              onItemDel(index);
            }}
          >
            <CloseCircleFill fontSize={14} />
          </div>
        )}
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
        capture={props.capture}
      ></input>
      {fileList.map((it, idx) => {
        const { type, name, url } = it;
        let src = "";
        let fileType = "";
        let downLoadUrl = undefined;

        // 判断文件类型，获取对应展示的数据
        if (typeof it === "string" || url) {
          src = url ? url : it;
          it = url ? url : it;
          // 图片
          if (
            it.startsWith("data:image/") ||
            (/[ ,]?image\//.test(accept) && checkImageUrl(it))
          ) {
            fileType = TYPE_IMG;
          }
          // 视频
          if (/[ ,]?video\//.test(accept) && checkVideoUrl(it)) {
            fileType = TYPE_VIDEO;
          }
        } else {
          // 图片
          if (type?.startsWith("image/")) {
            src = getFileURL(it);
            fileType = TYPE_IMG;
          }

          // 视频
          if (type?.startsWith("video/")) {
            src = getFileURL(it);
            fileType = TYPE_VIDEO;
            // TODO: 确认下载逻辑
            downLoadUrl = src;
          }
        }

        if (fileType === TYPE_IMG) {
          return (
            <ItemRender index={idx} key={name + "_" + idx}>
              <Image className="file-item-view" src={src} alt={name} />
            </ItemRender>
          );
        }
        if (fileType === TYPE_VIDEO) {
          return (
            <ItemRender index={idx} key={name + "_" + idx}>
              <Video src={src} href={downLoadUrl} />
            </ItemRender>
          );
        }

        return it.name;
      })}
      {disabled || readOnly || (!multiple && fileList.length > 0) ? null : (
        <>
          <Button
            className="uploader-add-btn"
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
            onAction={onPicker}
            onClose={() => setActionSheetVisible(false)}
          />
        </>
      )}
    </div>
  );
}

export default Uploader;
