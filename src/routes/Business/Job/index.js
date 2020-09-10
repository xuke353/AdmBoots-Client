import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/job',
  title: '任务列表',
  component: dynamicWrapper(app, [import('./model')], () =>
    import('./components')
  ),
  exact: true,
});

export default (app) => createRoute(app, routesConfig);
