const path = require("path");
const fs = require("fs");

// node ./src/auto-write-router.js

const res = fs.readdirSync(path.join(__dirname, "./src/pages"));
console.log(res);
`[
  { path: "/form-test", component: "@/pages/form-test" },
  { path: "/table-test", component: "@/pages/table-test" },
  { path: "/map-test", component: "@/pages/map-test" },
  { path: "/mobile-form-test", component: "@/pages/mobile-form-test" },
]`;

if (res) {
  const routes = [];
  res.forEach((item) => {
    if (/\.jsx|\.tsx|\.js|\.ts|\.less|\.scss|\.css$/.test(item)) {
      return;
    }
    routes.push({
      path: `/${item}`,
      component: `@/pages/${item}`,
    });
  });

  fs.writeFileSync(
    path.join(__dirname, "./src/router/routes.js"),
    `const routes = ${JSON.stringify(routes, null, 2)?.replace(
      /"(\(\) => import\('@\/views\/.+?\/index.vue'\))"/g,
      "$1",
    )};
  
  export default routes;
  `,
  );
}
