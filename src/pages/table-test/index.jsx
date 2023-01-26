import ListRender from "@packages/list-render";
import DataModel from "@packages/data-model";

import demoSchema from "./demo.schema.json";

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
      <ListRender schema={demoSchema} model={dm} />
    </div>
  );
}

export default TableTest;
