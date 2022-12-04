import { defineConfig } from 'umi';
import path from 'path';

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
    '@packages': path.resolve(__dirname, 'packages'),
  },
});
