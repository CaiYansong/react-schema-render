
/**
 *  建立一个可以存取该 file 的 url
 * @param {Object} file 文件
 * @returns {string} url
 * blob:http://localhost:8000/c9950644-5118-4231-9be7-8183bde1fdc7
 */
export function getFileURL(file) {
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

/**
 * 判断 url 是否带有指定图片后缀
 * @param {string} url
 * @returns
 */
export function checkImageUrl(url) {
  const imgTypes = [
    "apng",
    "avif",
    "bmp",
    "gif",
    "ico",
    "cur",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "svg",
    "tif",
    "tiff",
    "webp",
  ];
  return checkUrlSuffix(url, imgTypes);
}

/**
 * 判断 url 是否带有指定视频后缀
 * @param {string} url 
 * @returns 
 */
export function checkVideoUrl(url) {
  const imgTypes = [
    "3gp",
    "mpg",
    "mpeg",
    "mp4",
    "m4v",
    "m4p",
    "ogv",
    "ogg",
    "mov",
    "webm",
  ];
  return checkUrlSuffix(url, imgTypes);
}

/**
 * 检查 url 是否带有指定后缀
 * @param {string} url url 地址
 * @param {Array} types 后缀数组
 * @returns
 */
export function checkUrlSuffix(url, types = [], caseSensitive) {
  if (!url) {
    return false;
  }
  let _url = url?.replace(/\?.+/, "");
  const reg = new RegExp(
    `\.(${types.join("|")})$`,
    caseSensitive ? undefined : "i",
  );
  if (reg.test(_url)) {
    return true;
  }
}