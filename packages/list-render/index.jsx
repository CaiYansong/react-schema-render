import { useEffect, useState, useRef } from 'react';
import { Button } from 'antd';

import ListQuery from './list-query';
import ListItemForm from './list-item-form';
import ListTable from './list-table';
import ListPagination from './list-pagination';

import './index.less';

function TableRender({ schema, idKey = 'id', tableConf }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      const _list = [];
      for (let i = 0; i < 11; i++) {
        _list.push({
          id: Date.now() + i,
          'input-2bf0d8e': 'input-2bf0d8e-' + i,
          'input-f9b7f9b': 'input-f9b7f9b-' + i,
          'input-59f411d': 'input-59f411d-' + i,
          'input-number-db290ce': i,
          'input-ip-90300ff': '127.0.0.1' + i,
          'select-b836c9c': 'option' + i,
          'select-api': 'select-api' + i,
          'select-func': 'select-func' + i,
          'cascader-ae1e13c': 'cascader-ae1e13c-' + i,
          'china-region-2bef44f': 'china-region-2bef44f-' + i,
          'china-location-d673726': 'china-location-d673726-' + i,
          'radio-c3fb0f5': 'option' + i,
          'checkbox-be5b6de': 'option' + i,
          'switch-f0d3254': i % 2 === 0,
          'date-picker-cce160e': Date.now() + i,
          'time-picker-9a14a1f': Date.now() + i,
        });
      }
      setList(_list);
    }, 1000);
  }, []);

  const itemFormRef = useRef();

  function onCreate() {
    console.log('onCreate');
    itemFormRef.current?.onShow();
  }

  function onEdit(row, idx) {
    console.log('onEdit', row, idx);
    itemFormRef.current?.onShow({ ...row }, '编辑');
  }
  function onDelete(row, idx) {
    console.log('onDelete', row, idx);
  }

  return (
    <div className="list-render">
      <div className="list-render-header">
        <ListQuery />
        <div className="list-action-wrap">
          <Button onClick={onCreate}>新增</Button>
        </div>
      </div>
      <ListTable
        schema={schema}
        list={list}
        idKey={idKey}
        config={tableConf}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ListPagination />
      <ListItemForm ref={itemFormRef} />
    </div>
  );
}

export default TableRender;
