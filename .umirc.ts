import { defineConfig } from "umi";
import path from "path";
// @ts-ignore
import AntdDayjsWebpackPlugin from "antd-dayjs-webpack-plugin";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
  },
  routes: [
    { path: "/", component: "@/pages/index" },
    { path: "/form-test", component: "@/pages/form-test" },
    { path: "/table-test", component: "@/pages/table-test" },
    { path: "/map-test", component: "@/pages/map-test" },
    { path: "/mobile-form-test", component: "@/pages/mobile-form-test" },
  ],
  fastRefresh: {},
  alias: {
    "@": "src/",
    "@packages": path.resolve(__dirname, "packages"),
  },
  chainWebpack(memo) {
    // dayjs 替换 moment
    memo.plugin("AntdDayjsWebpackPlugin").use(new AntdDayjsWebpackPlugin(), [
      {
        preset: "antdv4", // antd 版本
      },
    ]);
  },
  devServer: {
    port: 8100,
  },
});
