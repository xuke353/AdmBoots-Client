import modelEnhance from '@/utils/modelEnhance';
import PageHelper from '@/utils/pageHelper';
/**
 * 当第一次加载完页面时为true
 * 可以用这个值阻止切换页面时
 * 多次初始化数据
 */
let LOADED = false;
export default modelEnhance({
  namespace: 'role',

  state: {
    pageData: PageHelper.create(),
    menus: [],
    permission: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/role' && !LOADED) {
          LOADED = true;
          dispatch({
            type: 'init',
          });
          // //初始化权限
          // dispatch({
          //   type: '@request',
          //   payload: {
          //     valueField: 'permission',
          //     url: '/v1/users/permission',
          //     data: { pathName: pathname },
          //     method: 'POST',
          //     afterResponse: (resp) => resp.data,
          //   },
          // });
        }
      });
    },
  },

  effects: {
    // 进入页面加载
    *init({ payload }, { call, put, select }) {
      const { pageData } = yield select((state) => state.role);
      yield put({
        type: 'getPageInfo',
        payload: {
          pageData: pageData.startPage(1, 20),
        },
      });
      yield put({
        type: 'getMenus',
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      yield put({
        type: '@request',
        payload: {
          valueField: 'pageData',
          url: '/v1/roles/getList',
          pageInfo: pageData,
          method: 'GET',
        },
      });
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select, take }) {
      const { values, success } = payload;
      const { pageData } = yield select((state) => state.role);
      // put是非阻塞的 put.resolve是阻塞型的
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: '/v1/roles/save',
          data: values,
        },
      });

      yield put({
        type: 'getPageInfo',
        payload: { pageData },
      });
      success();
    },
    // 修改
    *update({ payload }, { call, put, select, take }) {
      const { record, values, success } = payload;
      values.id = record.id;
      const { pageData } = yield select((state) => state.role);
      // put是非阻塞的 put.resolve是阻塞型的
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: `/v1/roles/update`,
          data: values,
          method: 'PUT',
        },
      });

      yield put({
        type: 'getPageInfo',
        payload: { pageData },
      });
      success();
    },
    // 删除 之后查询分页
    *remove({ payload }, { call, put, select }) {
      const { records, success } = payload;
      const { pageData } = yield select((state) => state.role);
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: '/v1/roles/delete',
          data: records.map((item) => item.rowKey),
          method: 'DELETE',
        },
      });
      yield put({
        type: 'getPageInfo',
        payload: { pageData },
      });
      success();
    },
    // 获取菜单树
    *getMenus({ payload }, { call, put }) {
      yield put({
        type: '@request',
        afterResponse: (resp) => resp.data,
        payload: {
          valueField: 'menus',
          url: '/v1/menus/getSimpleMenus',
          method: 'GET',
        },
      });
    },
    // 给菜单赋角色
    *distributeMenus({ payload }, { call, put, select }) {
      const { roleId, checkedKeys, success } = payload;
      const { pageData } = yield select((state) => state.role);
      //这里要用resolve，防止更新未完成就返回数据
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: '/v1/roles/updateRoleMenu',
          data: { roleId, menuIds: checkedKeys },
          method: 'PUT',
        },
      });
      yield put({
        type: 'getPageInfo',
        payload: { pageData },
      });
      success();
    },
  },

  reducers: {},
});
