/**
 * 获取 fieldList 中的远程选项数据
 * @param {Array} fieldList
 * @param {Object} config
 * @param {string} scenario
 * @returns
 */
function handleRemoteData(fieldList, config, scenario) {
  if (!fieldList) {
    return;
  }
  return new Promise((resolve, reject) => {
    const promise = [];
    fieldList.forEach((field) => {
      if (!field.isRemote) {
        return;
      }
      promise.push(
        getRemoteData(field, config, scenario).then((res) => {
          field.options = res;
          return res;
        }),
      );
    });
    Promise.allSettled(promise).then((res) => {
      resolve(res);
    });
  });
}

/**
 * 获取远程选项数据
 * @param {Object} field
 * @param {Object} config
 * @param {string} scenario
 * @returns
 */
export function getRemoteData(field, config, scenario) {
  return new Promise((resolve, reject) => {
    if (field && !field.isRemote) {
      reject(new Error("非远程项."));
      return;
    }
    if (!field || !field.remoteConf) {
      reject(new Error("请传入正确的参数!"));
      return;
    }
    const { remoteConf = {} } = field;

    if (remoteConf.type === "func" && remoteConf.func) {
      // 只能这样拿到 AsyncFunction
      // 直接写 Object.getPrototypeOf(async function(){}).constructor
      // 会被 babel 转成 Function
      const getAsyncFunction = new Function(
        `return Object.getPrototypeOf(async function(){}).constructor;`,
      );
      const AsyncFunction = getAsyncFunction();

      let fetchFunc = new AsyncFunction(
        "config",
        "scenario",
        `${remoteConf.func}`,
      );
      fetchFunc = fetchFunc.bind(this);
      fetchFunc(config, scenario).then((options) => {
        resolve(options);
      });
    } else if (remoteConf.type === "api" && remoteConf.api) {
      fetch(remoteConf.api, {
        method: "get",
        headers: config?.headers || {},
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 200) {
            resolve(res.data);
          }
        })
        .catch((error) => {
          console.error("Error select remote api: ", error);
        });
    }
  });
}

export default handleRemoteData;
