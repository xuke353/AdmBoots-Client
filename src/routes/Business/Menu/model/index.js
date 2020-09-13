import PageHelper from '@/utils/pageHelper';
import {
  getPageInfo,
  getCascadeOptions,
  saveMenu,
  updateMenu,
  deleteMenu,
} from '../service';
/**
 * 当第一次加载完页面时为true
 * 可以用这个值阻止切换页面时
 * 多次初始化数据
 */
let LOADED = false;
export default {
  namespace: 'menu',

  state: {
    pageData: PageHelper.create(),
    cascadeMenus: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/menu' && !LOADED) {
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
      const { pageData } = yield select((state) => state.menu);
      yield put({
        type: 'getPageInfo',
        payload: {
          pageData,
        },
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      const { status, data } = yield call(
        getPageInfo,
        PageHelper.requestFormat(pageData)
      );
      if (status) {
        pageData.list = data;
        yield put({
          type: 'getPageInfoSuccess',
          payload: pageData,
        });

        yield put({
          type: 'getCascadeMenus',
        });
      }
    },
    // 获取菜单级联下拉数据源
    *getCascadeMenus({ payload }, { call, put }) {
      const { status, data } = yield call(getCascadeOptions);
      if (status) {
        yield put({
          type: 'getCascadeMenusSuccess',
          payload: data,
        });
      }
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select }) {
      const { values, success } = payload;
      const { pageData } = yield select((state) => state.menu);
      const { status } = yield call(saveMenu, values);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData },
        });
      }
    },
    // 修改
    *update({ payload }, { call, put, select }) {
      const { record, values, success } = payload;
      const { pageData } = yield select((state) => state.menu);
      const { status } = yield call(updateMenu, {id:record.id, data: values});
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData },
        });
      }
    },
    // 删除
    *remove({ payload }, { call, put, select }) {
      const { records, success } = payload;
      const ids = records.map((item) => item.id);
      const { pageData } = yield select((state) => state.menu);
      const { status } = yield call(deleteMenu, ids);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData },
        });
      }
    },
  },

  reducers: {
    getPageInfoSuccess(state, { payload }) {
      return {
        ...state,
        pageData: payload,
      };
    },
    getCascadeMenusSuccess(state, { payload }) {
      return {
        ...state,
        cascadeMenus: payload,
      };
    },
  },
};
