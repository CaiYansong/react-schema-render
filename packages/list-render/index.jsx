import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, message } from "antd";
import _ from "lodash";

import handleRemoteData from "@packages/form-render/common/remote-data";

import { imgsToBase64, imgToBase64 } from "@packages/form-render/common/img";

import QueryRender from "./query-render";
import Pagination from "./pagination-render";
import TableRender from "./table-render";
import FormDialog from "./form-dialog";

import "./index.less";

function ListRender(props, parentRef) {
  const { idKey = "id" } = props;
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const formDialogRef = useRef();

  useImperativeHandle(parentRef, () => ({
    getList,
    onSearch,
    forceUpdate,
  }));

  const { schema = {}, config = {}, model = {} } = props;

  const { formConf = {}, fieldList } = schema || {};

  useEffect(() => {
    // 处理远程选项
    handleRemoteData(
      fieldList,
      { ...(props.formConf || {}), ...(config || {}) },
      "list",
    ).then(() => {
      // 刷新数据，保证显示正常
      setList((list) => _.cloneDeep(list));
    });

    if (props.model) {
      if (!props.model.query) {
        props.model.query = {};
      }
      props.model.query.pageNum = 1;

      getList();
    }
  }, []);

  useEffect(() => {
    if (props.model && !props.model?.query) {
      props.model.query = {};
    }
  }, [props.model?.query]);

  function getList(query = props.model.query) {
    console.log("query", query);
    if (!model?.getList) {
      return;
    }
    model
      ?.getList(query)
      .then((res) => {
        setList(res.list);
        setTotal(res.pagination?.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onPageChange(page, size) {
    if (props.model && !props.model.query) {
      props.model.query = {};
    }
    props.model.query.pageNum = page;
    props.model.query.pageSize = size;
    getList();
  }

  function onSearch(query) {
    if (props.model && !props.model.query) {
      props.model.query = {};
    }
    props.model.query.pageNum = 1;
    if (props.model && props.model.query && !props.model.query.pageSize) {
      props.model.query.pageSize = 10;
    }
    getList(query);
  }

  function forceUpdate() {
    setList((l) => _.cloneDeep(l));
  }

  function onCreate() {
    formDialogRef.current.show().then(async (form) => {
      const data = await getFormData(form, schema);
      model
        ?.create(data)
        .then((res) => {
          onSearch();
          message.success(res._message || "新增成功");
        })
        .catch((err) => {
          console.error("err", err);
          message.error(err._message || "未知错误");
        });
    });
  }

  function onEdit(row, idx) {
    if (props.fetchOnEdit !== false) {
      model.get({ id: row[idKey] }).then((res) => {
        handleEdit(res, row[idKey]);
      });
    } else {
      handleEdit(row);
    }
  }

  function handleEdit(data, id) {
    formDialogRef.current.show(data, "编辑").then(async (form) => {
      const data = await getFormData(form, schema);
      model
        ?.update(data, { id })
        .then((res) => {
          getList();
          message.success(res?._message || "编辑成功");
        })
        .catch((err) => {
          console.error("err", err);
          message.error(err._message || "未知错误");
        });
    });
  }

  function onDel(row, idx) {
    model
      ?.delete({ id: row[idKey] })
      .then((res) => {
        message.success(res._message || "删除成功");
        onSearch();
      })
      .catch((err) => {
        message.error(err._message || "未知错误");
      });
  }

  return (
    <div className="list-render">
      <div className="list-header">
        {props.hasQuery !== false ? (
          <QueryRender
            schema={props.schema}
            formConf={props.formConf}
            search={props.search}
            filters={props.filters}
            onSearch={onSearch}
          />
        ) : (
          <div className="query-render"></div>
        )}
        <div className="header-render">
          {props.hasCreate !== false ? (
            <Button onClick={onCreate} type="primary">
              新增
            </Button>
          ) : null}
        </div>
      </div>
      <TableRender
        idKey={props.idKey}
        schema={props.schema}
        list={list}
        formConf={props.formConf}
        config={props.tableConf}
        hasAction={props.hasAction}
        slots={props.slots}
        onEdit={onEdit}
        onDel={onDel}
      />
      <Pagination
        onChange={onPageChange}
        total={total}
        query={props.model?.query}
      />
      <FormDialog
        ref={formDialogRef}
        schema={schema}
        formConf={props.formConf}
      />
    </div>
  );
}

function getFormData(form, schema) {
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
          } else if (f.accept?.startsWith("image/")) {
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
          } else if (
            f.accept?.startsWith("image/") ||
            val?.type?.startsWith("image/")
          ) {
            const _p = imgToBase64(val?.originFileObj || val).then((res) => {
              data[f.name] = res;
              return res;
            });
            promise.push(_p);
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

export default forwardRef(ListRender);
