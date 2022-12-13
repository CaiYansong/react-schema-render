import React, { useEffect, useState } from "react";
import { SearchBar, Button, InfiniteScroll, Card } from "antd-mobile";

import "./index.less";

function ListRender(props) {
  const {
    model = {},
    children,
    itemTitleKey = "name",
    stickyTop = "8vw",
    itemRender,
    hasSearch = true,
    query,
  } = props;

  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState();
  const [list, setList] = useState([]);

  function onLoadMore(isRetry) {
    if (!model.query) {
      model.query = {
        pageSize: 10,
      };
    }
    if (!model.query.pageSize) {
      model.query.pageSize = 10;
    }
    model.query.pageNumber = (model.query.pageNumber || 0) + 1;
    getList();
  }

  function onSearch(_search) {
    model.query.pageNumber = 1;
    model.query.search = typeof _search === "string" ? _search : search;
    setHasMore(true);
    getList();
  }

  function getList() {
    // TODO: 接口错误逻辑处理
    return model.getList(query).then((res) => {
      if (!res || res.list.length <= 0) {
        setHasMore(false);
        return;
      }
      let _list = res?.list || [];
      if (model.query.pageNumber > 1) {
        _list = [...list, ..._list];
      }
      setList(_list);
    });
  }

  return (
    <div className="list-render">
      {hasSearch ? (
        <div className="list-search" style={{ top: stickyTop }}>
          <div className="header-left">
            <SearchBar
              placeholder="请输入搜索内容"
              onSearch={onSearch}
              onClear={() => {
                onSearch("");
              }}
              onChange={setSearch}
            />
          </div>
          <div className="header-right">
            <Button size="small" color="primary" onClick={onSearch}>
              搜索
            </Button>
          </div>
        </div>
      ) : null}
      {list?.map((item, index) => {
        if (itemRender) {
          return itemRender(item, index);
        }
        return (
          <Card
            title={item[itemTitleKey]}
            key={`${item.id}-${index}`}
            style={{ margin: "0 1vw 1vw", border: "1px solid #ccc" }}
          >
            {children ? (
              React.Children.map(children, (childItem) => {
                return React.cloneElement(childItem, {
                  item,
                  key: `${item.id}-${index}`,
                });
              })
            ) : (
              <div>{item.id}</div>
            )}
          </Card>
        );
      })}
      <InfiniteScroll loadMore={onLoadMore} hasMore={hasMore} />
    </div>
  );
}

export default ListRender;
