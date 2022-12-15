import React from "react";
import { Card } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";

import "./index.less";

function _itemRender(props = {}) {
  const { item, index, itemRender, children } = props || {};
  if (typeof itemRender === "function") {
    return itemRender(item, index);
  }

  const { isAllClick, onDetail } = props || {};
  if (children) {
    return React.Children.map(children, (childItem) => {
      return React.cloneElement(childItem, {
        key: `${item.id}-${index}`,
        item,
        data: item,
        isAllClick,
        onDetail,
      });
    });
  }
}

function CardItem({
  item,
  index,
  itemTitleKey,
  itemRender,
  actionsRender,
  isAllClick,
  onDetail,
  hasDetailIcon = true,
  hasAction,
  children,
}) {
  return (
    <Card
      className="list-card-item"
      title={item[itemTitleKey]}
      key={`${item.id}-${index}`}
    >
      {hasDetailIcon ? (
        <div
          className="list-card-item-wrap"
          onClick={() => {
            isAllClick && onDetail && onDetail(item, index);
          }}
        >
          <div className="list-card-item-container">
            {_itemRender({
              item,
              index,
              itemRender,
              children,
              isAllClick,
              onDetail,
            })}
          </div>
          <RightOutline
            className="item-detail-icon"
            fontSize={24}
            color="#aaa"
            onClick={() => {
              !isAllClick && onDetail && onDetail(item, index);
            }}
          />
        </div>
      ) : (
        _itemRender({ item, index, itemRender, children, isAllClick, onDetail })
      )}
      {/* 操作栏 */}
      {actionsRender && hasAction !== false ? (
        <div className="list-card-item-actions">
          {typeof actionsRender === "function"
            ? actionsRender(item, index)
            : actionsRender}
        </div>
      ) : null}
    </Card>
  );
}

export default CardItem;
