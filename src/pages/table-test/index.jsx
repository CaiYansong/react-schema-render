import { Input } from "antd";

import ListRender from "@packages/pc/list-render";
import DataModel from "@packages/utils/data-model";

import demoSchema from "@packages/pc/form-render/demo.schema.json";

import treeSchema from "./tree.schema.json";

const dm = new DataModel({
  getListApi: "/api/v1/table/list",
  getApi: "/api/v1/table/:id",
  createApi: "/api/v1/table",
  updateApi: "/api/v1/table/:id",
  deleteApi: "/api/v1/table/:id",
});

const localList = [];

for (let i = 0; i < 60; i++) {
  localList.push({
    id: i,
    name: "name " + i,
  });
}

const treeList = [];

for (let i = 0; i < 60; i++) {
  const children = [];
  for (let j = 0; j < 5; j++) {
    const childChildren = [];
    for (let k = 0; k < 2; k++) {
      childChildren.push({
        id: i + "-" + j + "-" + k,
        name: "name " + i + "-" + j + "-" + k,
        age: parseInt(Math.random() * 100),
      });
    }
    children.push({
      id: i + "-" + j,
      name: "name " + i + "-" + j,
      age: parseInt(Math.random() * 100),
      children: childChildren,
      testE: childChildren.map((it) => ({ ...it, name: it.name + "TE" })),
    });
  }
  treeList.push({
    id: "" + i,
    name: "name " + i,
    age: parseInt(Math.random() * 100),
    children,
    testE: children.map((it) => ({ ...it, name: it.name + "TE" })),
  });
}

function TableTest(props) {
  const config = {
    getOptions() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: "Remote 1",
              value: "remote1",
            },
            {
              label: "Remote 2",
              value: "remote2",
            },
          ]);
        }, 1000);
      });
    },
    getCascaderOptions() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: "Remote 1",
              value: "remote1",
            },
            {
              label: "Remote 2",
              value: "remote2",
              children: [
                {
                  label: "Remote 21",
                  value: "remote21",
                },
              ],
            },
          ]);
        }, 1000);
      });
    },
  };

  return (
    <div>
      <h1>DataModel</h1>
      <ListRender
        schema={demoSchema}
        model={dm}
        formSlots={{
          slotName({ value, onChange }) {
            return <Input value={value} onChange={onChange} />;
          },
        }}
        formConf={config}
      />
      <h1>list props</h1>
      <ListRender
        schema={demoSchema}
        list={localList}
        formSlots={{
          slotName({ value, onChange }) {
            return <Input value={value} onChange={onChange} />;
          },
        }}
        formConf={config}
      />
      <h1>树形数据展示</h1>
      <ListRender
        schema={treeSchema}
        tableConf={{ expandable: { childrenColumnName: "testE" } }}
        list={treeList}
        formSlots={{
          slotName({ value, onChange }) {
            return <Input value={value} onChange={onChange} />;
          },
        }}
        formConf={config}
      />
    </div>
  );
}

export default TableTest;
