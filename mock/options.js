export default {
  "GET /api/v1/options"(req, res) {
    const list = [];
    for (let i = 0; i < 9; i++) {
      list.push({
        value: i,
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
};
