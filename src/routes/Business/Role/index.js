import { dynamicWrapper, createRoute } from '@/utils/core';
  
const routesConfig = app => ({
  path: '/role',
  title: '角色管理',
  component: dynamicWrapper(app, [import('./model')], () =>
    import('./components')
  ),
  exact: true
});

export default app => createRoute(app, routesConfig);
export const PAGE_CODE = 'juesgl';