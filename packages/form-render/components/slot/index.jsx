import React from 'react';

function Slot(props) {
  const { children, name, data, scenario, formInstance, onChange } =
    props || {};
  return (
    <>
      {React.Children.map(children, function (childItem) {
        return React.cloneElement(childItem, {
          name,
          data,
          scenario,
          formInstance,
          onChange,
        });
      })}
    </>
  );
}

export default Slot;
