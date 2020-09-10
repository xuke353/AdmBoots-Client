import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/menu',
  title: '菜单管理',
  component: dynamicWrapper(app, [import('./model')], () =>
    import('./components')
  ),
  exact: true,
});

export default (app) => createRoute(app, routesConfig);
