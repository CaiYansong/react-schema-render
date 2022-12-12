import _ from "lodash";
import axios from "axios";

class DataModel {
  constructor(params) {
    const {
      ctx,
      query,
      createApi,
      createMap,
      getApi,
      getMap,
      getListApi,
      getListMap,
      getListFunc,
      updateApi,
      updateMap,
      deleteApi,
      multipleDeleteApi,
      axiosConf,
    } = params;

    this.ctx = ctx || {};
    this.query = query || {};
    this.axios = params.axios || axios;
    this.axiosConf = axiosConf || {};

    this.createApi = createApi;
    this.createMap = createMap;
    this.getApi = getApi;
    this.getMap = getMap;
    this.getListApi = getListApi;
    this.getListMap = getListMap;
    this.getListFunc = getListFunc;
    this.updateApi = updateApi;
    this.updateMap = updateMap;
    this.deleteApi = deleteApi;
    this.multipleDeleteApi = multipleDeleteApi;
  }

  getApiUrl(api, record, ctx) {
    if (!api) {
      throw new Error("Error getApiUrl api 不能为空", api, record, ctx);
    }
    let apiUrl = api;
    const params = _.merge({}, record, ctx);
    _.each(params, (value, key) => {
      if (!_.isString(value) || !_.isNumber(value) || _.isBoolean(value)) {
        apiUrl = apiUrl.replace(`:${key}`, value);
      }
    });
    return apiUrl;
  }

  create(params, ctx) {
    return new Promise((resolve, reject) => {
      const apiUrl = this.getApiUrl(this.createApi, params, ctx);
      const opt = { ...this.axiosConf };
      if (params instanceof FormData) {
        opt.headers = { "Content-Type": "multipart/form-data" };
      }
      this.axios
        .post(apiUrl, params, opt)
        .then((response) => {
          this.handleRes(response, resolve, reject);
        })
        .catch((err) => this.errorHandler(err, reject));
    });
  }

  get(ctx) {
    return new Promise((resolve, reject) => {
      const apiUrl = this.getApiUrl(this.getApi, this.query, ctx);
      this.axios
        .get(apiUrl, {
          ...this.axiosConf,
          params: { ...this.query, ...ctx },
        })
        .then((response) => {
          this.handleRes(
            response,
            (res) => {
              if (this.getMap) {
                res = this.getMap(res);
              }
              resolve(res);
            },
            reject,
          );
        })
        .catch((err) => this.errorHandler(err, reject));
    });
  }

  async getList(q, ctx) {
    let query = _.merge({}, this.query, q);
    query = _.pickBy(query, (val) => !_.isNil(val) && val !== "");

    let resultList = null;
    if (this.getListFunc) {
      resultList = await this.getListFunc(query);
    } else {
      const getPro = new Promise((resolve, reject) => {
        const apiUrl = this.getApiUrl(this.getListApi, ctx);
        this.axios
          .get(apiUrl, {
            ...this.axiosConf,
            params: query,
          })
          .then((response) => {
            if (response && typeof response === "object") {
              this.handleGetList(response, resolve, reject);
            }
          })
          .catch((err) => this.errorHandler(err, reject));
      });
      resultList = await getPro;
    }
    return resultList;
  }

  handleGetList(response, resolve, reject) {
    let { data } = response.data || {};
    if (data === undefined && response.data) {
      data = response.data;
    }
    if (data) {
      // in case data === null
      let pagination = {};
      let list = [];
      if (data.list) {
        pagination = data.pagination || { total: data.total };
        list = data.list;
      }
      if (data.rows) {
        pagination = data.pagination || { total: data.total };
        list = data.rows;
      }
      if (Array.isArray(data)) {
        pagination.total = data.length;
        list = data;
      }
      if (this.getListMap) {
        list = list.map((record) => this.getListMap(record));
      }
      resolve({ list: list || [], pagination });
    } else {
      resolve({ list: [], pagination: { total: 0 } });
    }
  }

  update(params, ctx) {
    return new Promise((resolve, reject) => {
      const apiUrl = this.getApiUrl(this.updateApi, params, ctx);
      const opt = { ...this.axiosConf };
      if (params instanceof FormData) {
        opt.headers = { "Content-Type": "multipart/form-data" };
      }
      this.axios
        .put(apiUrl, params, opt)
        .then((response) => {
          this.handleRes(response, resolve, reject);
        })
        .catch((err) => this.errorHandler(err, reject));
    });
  }

  delete(params, ctx) {
    return new Promise((resolve, reject) => {
      const apiUrl = this.getApiUrl(this.deleteApi, params, ctx);
      this.axios
        .delete(apiUrl, { ...this.axiosConf, ...params })
        .then((response) => {
          this.handleRes(response, resolve, reject);
        })
        .catch((err) => this.errorHandler(err, reject));
    });
  }

  multipleDelete(params, ctx) {
    return new Promise((resolve, reject) => {
      const apiUrl = this.getApiUrl(this.multipleDeleteApi, params, ctx);
      axios({
        method: "DELETE",
        url: apiUrl,
        data: params,
      })
        .then((response) => {
          this.handleRes(response, resolve, reject);
        })
        .catch((err) => this.errorHandler(err, reject));
    });
  }

  handleRes(response, resolve, reject) {
    if (!(response && typeof response === "object")) {
      reject(new Error("response not object"));
      return;
    }
    const {
      data: { code, message, data, msg },
    } = response;
    if (code === 200) {
      if (data && _.isObject(data) && data.message === undefined) {
        // 前缀 _ 避免与 data 里已有的 message 冲突
        data._message = message || msg;
      }
      resolve(data);
    } else {
      const error = new Error(message || msg);
      error.code = code;
      error.response = response;
      error._message = message || msg;
      reject(error);
    }
  }

  errorHandler(err, reject) {
    const response = err.response || err;
    if (response) {
      const message =
        (response.data && (response.data.message || response.data.msg)) ||
        response.msg;
      const error = new Error(message || response.statusText || "未知错误");
      error.code = response.status;
      error.response = response;
      if (message) {
        // 前缀 _ 避免与 data 里已有的 message 冲突
        error._message = message;
      }
      return reject(error);
    }
    return reject(err);
  }
}

export default DataModel;
