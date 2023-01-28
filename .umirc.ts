import { defineConfig } from "umi";
import path from "path";
// @ts-ignore
import AntdDayjsWebpackPlugin from "antd-dayjs-webpack-plugin";

// @ts-ignore
import routes from "./src/router/routes";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
  },
  routes: [...routes, { path: "/", component: "@/pages" }],
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
