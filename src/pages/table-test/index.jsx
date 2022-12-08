import ListRender from "@packages/list-render";

import demoSchema from "./demo.schema.json";

function TableTest(props) {
  return (
    <div>
      <ListRender schema={demoSchema} />
    </div>
  );
}

export default TableTest;
