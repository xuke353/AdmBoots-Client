import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/mailSetting',
  title: '邮箱设置',
  component: dynamicWrapper(app, [import('./model')], () =>
    import('./components')
  ),
  exact: true,
});

export default (app) => createRoute(app, routesConfig);