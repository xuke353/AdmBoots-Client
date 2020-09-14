import { getPageInfo, add} from '../service';
/**
 * 当第一次加载完页面时为true
 * 可以用这个值阻止切换页面时
 * 多次初始化数据
 */
let LOADED = false;
export default {
  namespace: 'mailSetting',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/mailSetting' && !LOADED) {
          //LOADED = true;
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },

  effects: {
    // 进入页面加载
    *init({ payload },{ call, put}) {
      yield put({
        type: 'getPageInfo',
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { status, data } = yield call(getPageInfo);
      if (status) {
        yield put({
          type: 'getPageInfoSuccess',
          payload: data,
        });
      }
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select }) {
      const { values, success } = payload;
      const { status } = yield call(add, values);
      if (status) {
        success();
        // yield put({
        //   type: 'getPageInfo',
        // });
      }
    },
  },
  reducers: {
    getPageInfoSuccess(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
