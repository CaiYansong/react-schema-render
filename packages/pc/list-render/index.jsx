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

import QueryRender from "./query-render";
import Pagination from "./pagination-render";
import TableRender from "./table-render";
import FormDialog from "./form-dialog";

import "./index.less";

const ListRender = forwardRef(function (props, parentRef) {
  const { idKey = "id" } = props;
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
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
      setListLoading(true);
      const { list } = props;
      const { pageNum = 1, pageSize = 10 } = model?.query || {};
      setList(list.slice(pageSize * (pageNum - 1), pageNum * pageSize));
      setTotal(list.length);
      setListLoading(false);
      return;
    }
    console.log("query", query);
    if (!model?.getList) {
      return;
    }
    setListLoading(true);
    model
      ?.getList(query)
      .then((res) => {
        setList(res.list);
        setTotal(res.pagination?.total);
        setListLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setListLoading(false);
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
    model.query = Object.assign(model.query, query);
    getList(query);
  }

  function forceUpdate() {
    setList((l) => _.cloneDeep(l));
  }

  function onCreate() {
    formDialogRef.current.show().then(async (form) => {
      const data = form;

      model
        ?.create(
          typeof model?.createMap === "function" ? model.createMap(data) : data,
        )
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
      const data = form;
      model
        ?.update(
          typeof model?.updateMap === "function" ? model.updateMap(data) : data,
          { id },
        )
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

  const { Slots = {} } = props;

  return (
    <div className="list-render">
      <div className="list-header">
        {props.hasQuery !== false ? (
          <QueryRender
            schema={props.schema}
            formConf={props.formConf}
            search={props.search}
            filters={props.filters}
            config={props.queryConf}
            onSearch={onSearch}
          />
        ) : (
          <div className="query-render"></div>
        )}
        <div className="header-render">
          {Slots.headerActionPrefix && <Slots.headerActionSuffix />}
          {props.hasCreate !== false ? (
            <Button onClick={onCreate} type="primary">
              新增
            </Button>
          ) : null}
          {Slots.headerActionSuffix && <Slots.headerActionSuffix />}
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
        loading={listLoading}
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
