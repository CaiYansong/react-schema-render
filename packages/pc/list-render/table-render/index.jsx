import { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";

import { getVal } from "../common/utils";

import "./index.less";

function TableRender(props) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!(props.schema && props.schema.fieldList)) {
      return;
    }
    const columns = [];
    /*
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: function(text, record, index) {},
    width: 'string | number',
    */
    // TODO: 确认是否区分 函数、ReactDom 插槽
    const { slots = {} } = props;
    props.schema.fieldList.forEach((field) => {
      if (field.inTable !== false) {
        const { name, label, type } = field;
        const _cloConf = {};

        if (props.config && props.config[name]) {
          const _conf = props.config[name];
          _cloConf.ellipsis = _conf.ellipsis;
        }

        if (slots && slots[name]) {
          columns.push({
            ..._cloConf,
            title: label,
            key: name,
            dataIndex: name,
            render: (text, record, index) => {
              const Slot = slots[name];
              if (typeof Slot === "function") {
                return Slot(text, record, index);
              }
              return Slot;
            },
          });
          return;
        }

        let render = function (text, record) {
          return getVal(field, record);
        };

        if (type === "date-picker" && field.mode === "datetime") {
          render = function (text, record) {
            const dateArr = getVal(field, record)?.split(" ") || [];
            return (
              <>
                <div>{dateArr[0]}</div>
                <div>{dateArr[1]}</div>
              </>
            );
          };
        }

        columns.push({
          ..._cloConf,
          title: label,
          key: name,
          dataIndex: name,
          render,
        });
      }
    });

    if (props.hasAction !== false) {
      const { hasEdit, hasDel } = props.config || {};
      columns.push({
        title: "操作",
        key: "_$actions",
        render(text, record, index) {
          if (props.actionSlot) {
            return props.actionSlot;
          }

          return (
            <>
              {slots?.actionPrefixSlot &&
                slots?.actionPrefixSlot(text, record, index)}
              {hasEdit !== false ? (
                <Button
                  type="link"
                  onClick={() => {
                    props.onEdit && props.onEdit(record, index);
                  }}
                >
                  编辑
                </Button>
              ) : null}
              {slots?.actionCenterSlot &&
                slots?.actionCenterSlot(text, record, index)}
              {hasDel !== false ? (
                <Popconfirm
                  placement="topRight"
                  title={"确认删除该项？"}
                  onConfirm={() => {
                    props.onDel && props.onDel(record, index);
                  }}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              ) : null}
              {slots?.actionSuffixSlot &&
                slots?.actionSuffixSlot(text, record, index)}
            </>
          );
        },
      });
    }

    setColumns(columns);
  }, [props.schema]);

  return (
    <div className="table-render-wrap">
      <Table
        className="table-render"
        rowKey={props.idKey || "id"}
        columns={columns}
        dataSource={props.list}
        pagination={false}
      />
    </div>
  );
}

export default TableRender;
