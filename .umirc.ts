import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/form-test', component: '@/pages/form-test' },
  ],
  fastRefresh: {},
  alias: {
    '@': 'src/',
  },
});
