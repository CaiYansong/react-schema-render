import { Input } from "antd";

import ListRender from "@packages/list-render";
import DataModel from "@packages/data-model";

import demoSchema from "@packages/form-render/demo.schema.json";

const dm = new DataModel({
  getListApi: "/api/v1/table/list",
  getApi: "/api/v1/table/:id",
  createApi: "/api/v1/table",
  updateApi: "/api/v1/table/:id",
  deleteApi: "/api/v1/table/:id",
});

function TableTest(props) {
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
      />
      <ListRender
        schema={demoSchema}
        model={dm}
        formSlots={{
          slotName({ value, onChange }) {
            return <Input value={value} onChange={onChange} />;
          },
        }}
      />
    </div>
  );
}

export default TableTest;
