import { getDateTimeVal } from "./utils";
import { imgsToBase64, imgToBase64, isImg } from "./img";

/**
 * 处理回填数据
 * @param {*} data
 * @param {*} fieldList
 * @returns
 */
export function handelBackData(data = {}, fieldList) {
  if (!data) {
    return data;
  }
  const res = _.cloneDeep(data);
  fieldList?.forEach((f) => {
    const { name, type } = f;
    const val = data[name];
    if ((type === "date-picker" || type === "time-picker") && val) {
      if (Array.isArray(val)) {
        val.forEach((it, i) => {
          res[name][i] = dayjs(it);
        });
      } else {
        res[name] = dayjs(data[name]);
      }
    } else if (type === "subform") {
      res[name] = handelBackData(res[name], f.fieldList);
    } else if (type === "item-list" && Array.isArray(res[name])) {
      res[name]?.forEach((it, i) => {
        res[name][i] = handelBackData(it, f.fieldList);
      });
    }
  });
  return res;
}

/**
 * 根据 schema.fieldList 格式化数据
 * @param {*} data
 * @param {*} fieldList
 * @returns
 */
export function getFormatData(data = {}, fieldList) {
  if (!data) {
    return data;
  }
  const res = _.cloneDeep(data);
  fieldList?.forEach((f) => {
    const { name, type } = f;
    const val = data[name];
    if ((type === "date-picker" || type === "time-picker") && val) {
      // f.valueFormat
      if (Array.isArray(val)) {
        val.forEach((it, i) => {
          res[name][i] = getDateTimeVal(it, f);
        });
      } else {
        res[name] = getDateTimeVal(data[name], f);
      }
    } else if (type === "switch") {
      res[name] =
        res[name] === true || res[name] === f.activeValue
          ? f.activeValue || true
          : f.inactiveValue || false;
    } else if (type === "input-file") {
      // 文件上传数据
      // TODO: 类型格式 url?
      res[name] = res[name]?.fileList || res[name];
      if (
        (f.multiple === false || f.multiple === undefined) &&
        Array.isArray(res[name]) &&
        res[name].length > 0
      ) {
        res[name] = res[name][0];
      }
    } else if (type === "subform") {
      res[name] = getFormatData(res[name], f.fieldList);
    } else if (type === "item-list" && Array.isArray(res[name])) {
      res[name]?.forEach((it, i) => {
        res[name][i] = getFormatData(it, f.fieldList);
      });
    }
  });
  return res;
}

/**
 * 获取提交数据
 * 目前主要处理图片数据格式
 * @param {*} form
 * @param {*} schema
 * @returns
 */
export function getSubmitFormData(form, schema) {
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
            const _d =
              val?.fileUrl ||
              val?.originFileObj?.fileUrl ||
              val.response ||
              val;
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
