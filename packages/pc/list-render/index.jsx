import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, message } from "antd";
import _ from "lodash";

import handleRemoteData from "@packages/pc/form-render/common/remote-data";

import { getFormData } from "./common/utils";

import QueryRender from "./query-render";
import Pagination from "./pagination-render";
import TableRender from "./table-render";
import FormDialog from "./form-dialog";

import "./index.less";

const ListRender = forwardRef(function (props, parentRef) {
  const { idKey = "id" } = props;
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const formDialogRef = useRef();

  useImperativeHandle(parentRef, () => ({
    getList,
    onSearch,
    forceUpdate,
    formDialogRef,
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

    if (model) {
      if (!model.query) {
        model.query = {};
      }
      model.query.pageNum = 1;
    }
    getList();
  }, []);

  useEffect(() => {
    if (model && !model?.query) {
      model.query = {};
    }
  }, [model?.query]);

  function getList(query = model?.query || {}) {
    if (!model?.getList && Array.isArray(props.list)) {
      const { list } = props;
      const { pageNum = 1, pageSize = 10 } = model?.query || {};
      setList(list.slice(pageSize * (pageNum - 1), pageNum * pageSize));
      setTotal(list.length);
      return;
    }
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
    if (model && !model.query) {
      model.query = {};
    }
    model.query.pageNum = page;
    model.query.pageSize = size;
    getList();
  }

  function onSearch(query) {
    if (model && !model.query) {
      model.query = {};
    }
    model.query.pageNum = 1;
    if (model && model.query && !model.query.pageSize) {
      model.query.pageSize = 10;
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
        idKey={idKey}
        schema={props.schema}
        list={list}
        formConf={props.formConf}
        config={props.tableConf}
        hasAction={props.hasAction}
        Slots={props.Slots}
        onEdit={onEdit}
        onDel={onDel}
      />
      <Pagination onChange={onPageChange} total={total} query={model?.query} />
      <FormDialog
        ref={formDialogRef}
        schema={schema}
        dialogConf={props.dialogConf}
        formConf={props.formConf}
        formSlots={props.formSlots}
        formInitialValues={props.formInitialValues}
        Slots={props.Slots}
      />
    </div>
  );
});

ListRender.defaultProps = {
  model: {
    query: {},
  },
};

export default ListRender;
