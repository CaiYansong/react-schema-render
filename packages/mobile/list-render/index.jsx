import React, { useEffect, useRef, useState } from "react";
import { SearchBar, Button, InfiniteScroll } from "antd-mobile";

import CardItem from "./card-item";
import TableItem from "./table-item";

import "./index.less";

function ListRender(props) {
  const {
    model,
    schema,
    listData,
    children,
    itemTitleKey = "name",
    stickyTop = "8vw",
    hasSearch = true,
    query,
    mode = "list",
    // 子项是否有详情按钮
    hasDetailIcon,
    // 子项是否有底部操作栏
    hasAction,
    // 是否滚动加载更多
    hasMore = true,
    // table 是否有 head
    hasHead = true,
    itemRender,
    actionsRender,
    // 是否整个 item 可点击
    isAllClick,
    onDetail,
  } = props;

  const isFirst = useRef();
  const [_hasMore, setHasMore] = useState(hasMore);
  const [search, setSearch] = useState();
  const [list, setList] = useState(listData || []);
  const { fieldList } = schema || {};

  useEffect(() => {
    if (model) {
      if (!model.query) {
        model.query = {};
      }
      if (
        model.query.pageNumber === undefined ||
        model.query.pageNumber === null
      ) {
        model.query.pageNumber = 1;
      }
      if (!model.query.pageSize) {
        model.query.pageSize = 10;
      }
    }
    // 无滚动加载更多、无数据、有 model，请求一次数据
    if (!hasMore && (!listData || listData.length <= 0) && model) {
      getList();
    }
    // 销毁后清除状态，解决 一个页面多 tab 多列表 dataModel 不销毁导致的缓存问题
    return () => {
      if (model && model.query) {
        model.query.pageNumber = 1;
      }
    };
  }, []);

  useEffect(() => {
    // listData 动态获取逻辑
    if (listData) {
      setList(listData);
    }
  }, [listData]);

  function onLoadMore(isRetry) {
    if (!model) {
      return;
    }
    if (!model.query) {
      model.query = {
        pageSize: 10,
      };
    }
    if (!model.query.pageSize) {
      model.query.pageSize = 10;
    }
    if (isFirst.current === undefined) {
      // 首次加载 pageNumber = 1
      isFirst.current = false;
      model.query.pageNumber = 1;
    } else {
      // loadMore pageNumber += 1
      model.query.pageNumber = (model.query.pageNumber || 1) + 1;
    }
    getList();
  }

  function onSearch(_search) {
    // TODO: 本地数据逻辑，listData 搜索？
    if (!model) {
      return;
    }
    model.query.pageNumber = 1;
    model.query.search = typeof _search === "string" ? _search : search;
    setHasMore(true);
    getList();
  }

  function getList() {
    // TODO: 接口错误逻辑处理
    return model
      .getList(query)
      .then((res) => {
        if (!res || res.list.length <= 0) {
          setHasMore(false);
          return res;
        }
        let _list = res?.list || [];
        if (model.query.pageNumber > 1) {
          _list = [...list, ..._list];
        }
        setList(_list);
        return res;
      })
      .catch((err) => {
        console.log("Error List Render getList: ", err);
      });
  }

  return (
    <div
      className={`list-render ${mode === "card" ? "list-render-card" : ""} ${
        mode === "table" ? "list-render-table" : ""
      }`}
    >
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
      {hasHead ? <TableItem fieldList={fieldList} isHead></TableItem> : null}
      {list?.map((item, index) => {
        const itemProps = {
          key: `${item.id}-${index}`,
          data: item,
          item: item,
          index: index,
          itemTitleKey: itemTitleKey,
          itemRender: itemRender,
          actionsRender: actionsRender,
          isAllClick,
          onDetail: onDetail,
          hasDetailIcon: hasDetailIcon,
          hasAction: hasAction,
          fieldList: fieldList,
        };
        if (mode === "card") {
          return <CardItem {...itemProps}>{children}</CardItem>;
        }
        if (mode === "table") {
          return (
            <TableItem {...itemProps} hasHead={hasHead}>
              {children}
            </TableItem>
          );
        }
        if (itemRender) {
          return itemRender(item, index);
        }
        if (mode === "list") {
          return (
            <div className="list-render-list-item">
              {item.id}-{item[itemTitleKey]}
            </div>
          );
        }
        return children ? (
          React.Children.map(children, (childItem) => {
            return React.cloneElement(childItem, {
              key: `${item.id}-${index}`,
              item,
              data: item,
              fieldList,
            });
          })
        ) : (
          <div key={`${item.id}-${index}`}>{item.id}</div>
        );
      })}
      {hasMore ? (
        <InfiniteScroll loadMore={onLoadMore} hasMore={_hasMore} />
      ) : null}
    </div>
  );
}

export default ListRender;

export { CardItem, TableItem };
