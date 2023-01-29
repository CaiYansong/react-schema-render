import { useEffect, useState } from "react";
import { Pagination } from "antd";

import "./index.less";

const pageSizeOptions = [10, 20, 50, 100];

function PaginationRender(props) {
  const [pageSize, setPageSize] = useState(
    props.query?.pageSize ||
      (props.pageSizeOptions ? props.pageSizeOptions[0] : pageSizeOptions[0]),
  );
  const [pageNum, setPageNumber] = useState(props.query?.pageNum || 1);

  useEffect(() => {
    const { query } = props;
    if (!query) {
      return;
    }
    if (query.pageSize && query.pageSize !== pageSize) {
      setPageSize(query.pageSize);
    }
    if (query.pageNum && query.pageNum !== pageNum) {
      setPageNumber(query.pageNum);
    }
  }, [props.query?.pageNum, props.query?.pageSize]);

  function onChange(page, size) {
    let _size = size;
    let _page = page;
    if (pageSize !== size) {
      _page = 1;
    }
    setPageSize(_size);
    setPageNumber(_page);
    props.onChange && props.onChange(_page, _size);
  }

  return (
    <div className="pagination-render-wrap">
      <Pagination
        className="pagination-render"
        current={pageNum}
        pageSize={pageSize}
        onChange={onChange}
        pageSizeOptions={props.pageSizeOptions || pageSizeOptions}
        total={props.total}
        showTotal={(total) => `总条数 ${total} 条`}
        showSizeChanger
      />
    </div>
  );
}

export default PaginationRender;
