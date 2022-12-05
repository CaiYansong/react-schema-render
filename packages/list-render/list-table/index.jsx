import { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';

let _columns = [];

function ListTable({
  schema,
  idKey,
  list,
  config,
  onEdit,
  onDelete,
}) {
  console.log('schema', schema);
  const fieldList = schema?.fieldList || [];
  const { hasAction } = config || {};
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    _columns = fieldList?.map((field) => {
      const { label, name } = field || {};
      return {
        title: label,
        dataIndex: name,
        key: name,
      };
    });
    if (hasAction !== false) {
      _columns.push({
        title: '操作',
        key: '$actionBtns',
        render: (_, record, index) => (
          <Space className="list-table-actions">
            <Button
              type="link"
              onClick={() => {
                onEdit && onEdit(record, index);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                onDelete && onDelete(record, index);
              }}
            >
              删除
            </Button>
          </Space>
        ),
      });
    }
    setColumns(_columns);
  }, [fieldList]);

  return <Table dataSource={list} columns={columns} rowKey={idKey}></Table>;
}

export default ListTable;
