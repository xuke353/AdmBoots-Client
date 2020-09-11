import modelEnhance from '@/utils/modelEnhance';
import PageHelper from '@/utils/pageHelper';
/**
 * 当第一次加载完页面时为true
 * 可以用这个值阻止切换页面时
 * 多次初始化数据
 */
let LOADED = false;
export default modelEnhance({
  namespace: 'user',

  state: {
    pageData: PageHelper.create(),
    roles: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/user' && !LOADED) {
          LOADED = true;
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },

  effects: {
    // 进入页面加载
    *init({ payload }, { call, put, select }) {
      const { pageData } = yield select((state) => state.user);
      yield put({
        type: 'getPageInfo',
        payload: {
          pageData: pageData.startPage(1, 20),
        },
      });
      yield put({
        type: 'getTransferRoles',
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      yield put({
        type: '@request',
        payload: {
          valueField: 'pageData',
          url: '/v1/users',
          pageInfo: pageData,
          method: 'GET',
        },
      });
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select, take }) {
      const { values, success } = payload;
      const { pageData } = yield select((state) => state.user);
      // put是非阻塞的 put.resolve是阻塞型的
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: '/v1/users',
          data: values,
          method: 'POST',
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
      const { pageData } = yield select((state) => state.user);
      // put是非阻塞的 put.resolve是阻塞型的
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: `/v1/users/${record.id}`,
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
      const { pageData } = yield select((state) => state.user);
      yield put.resolve({
        type: '@request',
        payload: {
          notice: true,
          url: '/v1/users',
          data: records.map((item) => item.id),
          method: 'DELETE',
        },
      });
      yield put({
        type: 'getPageInfo',
        payload: { pageData },
      });
      success();
    },
    // 获角色穿梭框数据源
    *getTransferRoles({ payload }, { call, put }) {
      yield put({
        type: '@request',
        afterResponse: (resp) => resp.data,
        payload: {
          valueField: 'roles',
          url: '/v1/roles/transferRoles',
          method: 'GET',
        },
      });
    },
    // 重置密码
    *resetPassword({ payload }, { call, put }) {
      const { id } = payload;
      yield put({
        type: '@request',
        payload: {
          notice: true,
          url: `/v1/users/resetPassword/${id}/pwd` + id,
          method: 'PUT',
        },
      });
    },
  },

  reducers: {},
});
