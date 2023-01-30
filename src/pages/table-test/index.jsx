import { Input } from "antd";

import ListRender from "@packages/pc/list-render";
import DataModel from "@packages/utils/data-model";

import demoSchema from "@packages/pc/form-render/demo.schema.json";

const dm = new DataModel({
  getListApi: "/api/v1/table/list",
  getApi: "/api/v1/table/:id",
  createApi: "/api/v1/table",
  updateApi: "/api/v1/table/:id",
  deleteApi: "/api/v1/table/:id",
});

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
      <ListRender
        schema={demoSchema}
        list={[
          {
            id: 1,
            name: 1,
            children: [{ id: 11, name: 11 }],
          },
        ]}
        formSlots={{
          slotName({ value, onChange }) {
            return <Input value={value} onChange={onChange} />;
          },
        }}
        formConf={config}
      />
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
    </div>
  );
}

export default TableTest;
