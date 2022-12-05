import {} from 'antd';

import ListQuery from './list-query';
import ListItemForm from './list-item-form';
import ListTable from './list-table';
import ListPagination from './list-pagination';

function TableRender(props) {
  return (
    <div>
      <ListQuery />
      <ListTable />
      <ListPagination />
      <ListItemForm />
    </div>
  );
}

export default TableRender;
