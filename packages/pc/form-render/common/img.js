const base64HeadReg = /(data:image\/(apng|bmp|gif|jpeg|pjpeg|png|svg+xml|tiff|webp|x\-icon);base64,)/g;
const base64Reg = /^(data:image\/(apng|bmp|gif|jpeg|pjpeg|png|svg+xml|tiff|webp|x\-icon);base64,).+/g;

/**
 * 图片转为 base64
 * @param {File} file 图片文件
 * @param {boolean} isRemovePrefix 是否去除 base64 头部信息
 * @returns
 */
export function imgToBase64(file, isRemovePrefix) {
  return new Promise((resolve) => {
    if (typeof file === "string" && base64Reg.test(file.trim())) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
      let res = evt.target.result;
      if (isRemovePrefix) {
        res = res.trim().replace(base64HeadReg, "");
      }
      resolve(res);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 批量图片转为 base64
 * @param {Array} files 图片文件数组
 * @param {boolean} isRemovePrefix 是否去除 base64 头部信息
 * @returns
 */
export function imgsToBase64(files, isRemovePrefix) {
  const promise = [];
  files?.forEach((file) => {
    promise.push(imgToBase64(file, isRemovePrefix));
  });
  return Promise.all(promise);
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
