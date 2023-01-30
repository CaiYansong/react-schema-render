# data model


## 示例

```javascript
const listDM = new DataModel({
  getListApi: "/api/v1/list/",
  getApi: "/api/v1/list/item/:id",
  createApi: "/api/v1/list/item", // post
  updateApi: "/api/v1/list/item/:id", // put
  deleteApi: "/api/v1/list/item/:id", // delete
});

listDM.getList().then(res => {
  console.log(res);
});

listDM.get({ id: 1 }).then(res => {
  console.log(res);
});

listDM.create({ id: 1, name: 'name' }).then(res => {
  console.log(res);
});

listDM.update({ id: 1, name: 'name-update' }).then(res => {
  console.log(res);
});

listDM.delete({ id: 1 }).then(res => {
  console.log(res);
});

```