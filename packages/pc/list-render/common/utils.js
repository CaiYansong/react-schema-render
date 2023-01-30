import _ from "lodash";
import dayjs from "dayjs";

import { imgsToBase64, imgToBase64 } from "@packages/pc/form-render/common/img";

const dateFormatEnum = {
  datetime: "YYYY-MM-DD HH:mm:ss",
  date: "YYYY-MM-DD",
};

/**
 * 获取 field 对应的值
 * @param {Object} field schema 项
 * @param {Object} data 数据
 * @param {Object} opt 配置项
 * @returns
 */
export function getVal(field = {}, data = {}, opt = {}) {
  let val = _.get(data, field.name);
  const { type, mode, multiple } = field || {};
  if (val && type === "date-picker") {
    if (Array.isArray(val)) {
      return val
        .map((it) => getDateVal(it, mode?.replace("range", ""), opt))
        .join(" ~ ");
    }
    return getDateVal(val, mode, opt);
  }

  if (val && type === "time-picker") {
    if (Array.isArray(val)) {
      return val.map((it) => dayjs(it).format("HH:mm:ss")).join(" ~ ");
    }
    return dayjs(val).format("HH:mm:ss");
  }

  if (type === "switch") {
    if (val === true || val === field.activeValue) {
      return field.activeText || "是";
    }
    if (val === undefined || val === false || val === field.inactiveValue) {
      return field.inactiveText || "否";
    }
    return val;
  }

  if (type === "select" && !Array.isArray(val)) {
    return field.options?.find((option) => option.value === val)?.label || val;
  } else if (type === "select" && multiple && Array.isArray(val)) {
    let _val = [];
    val.forEach((valIt) => {
      _val.push(
        field.options?.find((option) => option.value === valIt)?.label || valIt,
      );
    });
    val = _val;
  }

  if (Array.isArray(val)) {
    return val.join("、");
  }

  return val;
}

export function getDateVal(val, mode, opt = {}) {
  const _formatEnum = opt.dateFormatEnum || dateFormatEnum;
  let format = _formatEnum[mode] || _formatEnum.date;
  return dayjs(val).format(format);
}

export function isImg(f) {
  const imgEnum = {};
  if (f.type !== "input-file") {
    return false;
  }
  if (!f.accept) {
    return false;
  }
  if (f.accept.startsWith("image/") || f.accept.startsWith("images/")) {
    return true;
  }
  const imgReg = /apng|bmp|gif|jpeg|pjpeg|png|svg+xml|tiff|webp|x\-icon/;
  if (imgReg.test(f.accept)) {
    return true;
  }
}

export function getFormData(form, schema) {
  return new Promise((resolve, reject) => {
    let data = _.cloneDeep(form);
    const inputFiles = [];

    const promise = [];

    schema.fieldList.forEach(async (f) => {
      // TODO: 确认接口具体格式，图片是否也是用 formData 上传
      if (f.activated !== false && f.type === "input-file") {
        const val = data[f.name];
        if (Array.isArray(val)) {
          if (f.action && f.uploadType === "base64") {
            const _d = val.map(
              (it) => it?.fileUrl || it?.originFileObj?.fileUrl || it,
            );
            promise.push(_d);
            data[f.name] = _d;
            promise.push(_d);
          } else if (isImg(f)) {
            const _p = imgsToBase64(
              val.map((it) => it?.originFileObj || it),
            ).then((res) => {
              data[f.name] = res;
              return res;
            });
            promise.push(_p);
          } else {
            let imgCount = 0;
            val.forEach((it, i) => {
              if (it?.type?.startsWith("image/")) {
                imgCount += 1;
                const _p = imgToBase64(it?.originFileObj || it).then((res) => {
                  data[f.name][i] = res;
                  return res;
                });
                promise.push(_p);
              }
            });
            if (imgCount < val.length) {
              inputFiles.push(f);
            }
          }
        } else {
          if (f.action && f.uploadType === "base64") {
            const _d = val?.fileUrl || val?.originFileObj?.fileUrl || val;
            data[f.name] = _d;
            promise.push(_d);
          } else if (isImg(f) || val?.type?.startsWith("image/")) {
            if (val) {
              const _p = imgToBase64(val?.originFileObj || val).then((res) => {
                data[f.name] = res;
                return res;
              });
              promise.push(_p);
            }
          } else {
            inputFiles.push(f);
          }
        }
      }
    });

    return Promise.all(promise).then(() => {
      // TODO: 确认接口格式
      if (inputFiles.length > 0) {
        const fd = new FormData();
        for (const key in data) {
          const val = data[key];
          if (val !== undefined && val !== null) {
            fd.append(key, data[key]);
          }
        }
        resolve(fd);
        return fd;
      }
      resolve(data);
      return data;
    });
  });
}
