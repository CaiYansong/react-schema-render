export default {
  "GET /api/v1/options"(req, res) {
    const list = [];
    for (let i = 0; i < 9; i++) {
      list.push({
        value: "" + i,
        label: "Label " + i,
      });
    }
    res.json({
      code: 200,
      data: {
        list,
      },
    });
  },
  "GET /api/v1/cascader"(req, res) {
    const list = [];
    for (let i = 0; i < 9; i++) {
      const children = [];

      for (let j = 0; j < 3; j++) {
        children.push({
          value: i + "-" + j,
          label: "Label " + i + "-" + j,
        });
      }

      list.push({
        value: "" + i,
        label: "Label " + i,
        children,
      });
    }
    res.json({
      code: 200,
      data: {
        list,
      },
    });
  },
};
