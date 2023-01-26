const store = {
  list: [],
};

export default {
  "GET /api/v1/table/list"(req, res) {
    const total = store.list.length;

    const { pageSize = 10, pageNum = 1 } = res.query || {};

    const startIdx = +pageNum + +pageSize * (+pageNum - 1) - 1;
    let list = store.list.slice(startIdx, startIdx + +pageSize);

    let current = +pageNum;

    const maxPage = Math.ceil(total / pageSize);

    if (current > maxPage) {
      current = maxPage;
      list = [];
    }

    res.json({
      code: 200,
      data: {
        list,
        pagination: {
          total,
          current,
        },
      },
    });
  },
  "GET /api/v1/table/:id"(req, res) {
    const { id } = req.params || {};
    const item = store.list.find((it) => it.id == id);

    if (item) {
      res.json({
        code: 200,
        data: item,
        msg: "",
      });
      return;
    }

    res.json({
      code: 200,
      data: {},
      msg: "未找到该项",
    });
  },
  "POST /api/v1/table"(req, res) {
    const data = {};

    Object.keys(req.body).forEach((key) => {
      console.log(key, typeof req.body[key]);
      // if (key!==)
    });
    store.list.push(req.body);

    res.json({
      code: 200,
      data: {},
      msg: "添加成功",
    });
  },
  "PUT /api/v1/table/:id"(req, res) {
    const { id } = req.params || {};
    const idx = store.list.findIndex((it) => it.id == id);

    if (idx >= 0) {
      store.list[idx] = req.params;
      res.json({
        code: 200,
        data: {},
        msg: "更新成功",
      });
      return;
    }

    res.json({
      code: 200,
      data: {},
      msg: "未找到该项",
    });
  },
  "DELETE /api/v1/table/:id"(req, res) {
    const { id } = req.params || {};
    const idx = store.list.findIndex((it) => it.id == id);

    if (idx >= 0) {
      store.list.splice(idx, 1);
      res.json({
        code: 200,
        data: {},
        msg: "删除成功",
      });
      return;
    }

    res.json({
      code: 200,
      data: {},
      msg: "未找到该项",
    });
  },
};
