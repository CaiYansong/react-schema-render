import { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";

import { getVal } from "../common/utils";

import "./index.less";

function TableRender(props) {
  const { config = {} } = props;
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
    const { Slots = {} } = props;
    props.schema.fieldList.forEach((field) => {
      if (field.inTable !== false) {
        const { name, label, type } = field;
        let _colConf = {};

        if (props.config?.colConf && props.config?.colConf[name]) {
          _colConf = props.config?.colConf[name];
        }

        if (Slots && Slots[name]) {
          columns.push({
            ..._colConf,
            title: label,
            key: name,
            dataIndex: name,
            render: (text, record, index) => {
              const Slot = Slots[name];
              const slotProps = { text, record, index, field };
              return <Slot {...slotProps} />;
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
          ..._colConf,
          title: label,
          key: name,
          dataIndex: name,
          render(text, record, index, ...args) {
            return (
              <div
                className={`${_colConf?.ellipsis ? "table-cell-ellipsis" : ""}`}
                style={{ width: _colConf?.width, maxWidth: "100%" }}
                title={
                  _colConf?.ellipsis === true || _colConf?.ellipsis?.showTitle
                    ? render(text, record, index, ...args)
                    : undefined
                }
              >
                {render(text, record, index, ...args)}
              </div>
            );
          },
        });
      }
    });

    if (props.hasAction !== false) {
      const { hasEdit, hasDel } = props.config || {};

      const _colConf = props.config?.colConf._$actions || {};

      columns.push({
        ..._colConf,
        title: "操作",
        key: "_$actions",
        render(text, record, index) {
          const slotProps = { text, record, index };

          if (Slots?.tableActionsSlot) {
            return <Slots.tableActionsSlot {...slotProps} />;
          }

          return (
            <div style={{ width: _colConf?.width, maxWidth: "100%" }}>
              {Slots?.actionPrefixSlot && (
                <Slots.actionPrefixSlot {...slotProps} />
              )}
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
              {Slots?.actionCenterSlot && (
                <Slots.actionCenterSlot {...slotProps} />
              )}
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
              {Slots?.actionSuffixSlot && (
                <Slots.actionSuffixSlot {...slotProps} />
              )}
            </div>
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
        rowSelection={config?.rowSelection}
        columns={columns}
        dataSource={props.list}
        pagination={false}
        scroll={config.scroll}
        expandable={config.expandable}
        loading={props.loading}
        onRow={config?.onRow}
      />
    </div>
  );
}

export default TableRender;
