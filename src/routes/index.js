import { createRoutes } from '@/utils/core';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import CardLayout from '@/layouts/CardLayout';
import NotFound from './Pages/404';
import Login from './Login';
import Dashboard from './Dashboard';
import Role from './Business/Role';
import User from './Business/User';
import Menu from './Business/Menu';
import Job from './Business/Job';
/**
 * 主路由配置
 * 
 * path 路由地址
 * component 组件
 * indexRoute 默认显示路由
 * childRoutes 所有子路由
 * NotFound 路由要放到最下面，当所有路由当没匹配到时会进入这个页面
 */
const routesConfig = app => [
  {
    path: '/sign',
    title: '登录',
    indexRoute: '/sign/login',
    component: UserLayout,
    childRoutes: [
      Login(app),
      NotFound()
    ]
  },
  {
    path: '/a',
    title: '三方系统',
    component: CardLayout,
    indexRoute: '/a/role',
    childRoutes: [
      //Dashboard(app),
      //Role(app),
      //User(app),
     // Menu(app),
      //Job(app),
      NotFound()
    ]
  },
  {
    path: '/',
    title: '系统中心',
    component: BasicLayout,
    indexRoute: '/dashboard',
    childRoutes: [
      Dashboard(app),
      Role(app),
      User(app),
      Menu(app),
      Job(app),
      NotFound()
    ]
  }
];

export default app => createRoutes(app, routesConfig);
