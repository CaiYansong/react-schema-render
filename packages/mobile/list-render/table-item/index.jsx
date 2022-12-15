import moment from "moment";

import "./index.less";

function getVal(val, field) {
  const { type, mode } = field || {};
  if (type === "date-picker") {
    return moment(val).format(
      mode === "datetime" ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD",
    );
  }
  return val;
}

function TableItem({ data, fieldList = [], isHead, index }) {
  if (isHead) {
    return (
      <div className="table-item-row table-item-head">
        {fieldList?.map((it, idx) => (
          <div
            className={`table-item-col table-item-col-${idx}`}
            key={`${it.name}_${idx}`}
          >
            {it.name}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`table-item-row table-item-row-${index}`}>
      {fieldList?.map((it, idx) => (
        <div
          className={`table-item-col table-item-col-${idx}`}
          key={`${it.name}_${idx}`}
        >
          {getVal(data[it.name], it)}
        </div>
      ))}
    </div>
  );
}

export default TableItem;
