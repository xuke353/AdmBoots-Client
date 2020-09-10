import modelEnhance from '@/utils/modelEnhance';
import PageHelper from '@/utils/pageHelper';
import { getPageInfo, operJob, addJob, getLogPageInfo } from '../service';
import objectAssign from 'object-assign';
/**
 * 当第一次加载完页面时为true
 * 可以用这个值阻止切换页面时
 * 多次初始化数据
 */
let LOADED = false;
export default {
  namespace: 'job',

  state: {
    pageData: PageHelper.create(),
    logPageData: PageHelper.create(),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/job' && !LOADED) {
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
      const { pageData } = yield select((state) => state.job);
      yield put({
        type: 'getPageInfo',
        payload: {
          pageData: pageData.startPage(1, 20),
        },
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      const { status, message, data } = yield call(
        getPageInfo,
        PageHelper.requestFormat(pageData)
      );
      if (status) {
        const newPageData = objectAssign(
          PageHelper.create(),
          pageData,
          PageHelper.responseFormat({ data })
        );
        yield put({
          type: 'getPageInfoSuccess',
          payload: newPageData,
        });
      }
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select, take }) {
      const { values, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(addJob, values);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 修改
    *update({ payload }, { call, put, select, take }) {
      const { record, values, success } = payload;
      values.id = record.id;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(addJob, values);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 删除
    *remove({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(operJob, {
        querys: { jobGroup: record.jobGroup, jobName: record.jobName },
        res: 'remove',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 开启任务
    *start({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(operJob, {
        querys: { jobGroup: record.jobGroup, jobName: record.jobName },
        res: 'start',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 暂停任务
    *pause({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(operJob, {
        querys: { jobGroup: record.jobGroup, jobName: record.jobName },
        res: 'pause',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 立即执行任务
    *execute({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(operJob, {
        querys: { jobGroup: record.jobGroup, jobName: record.jobName },
        res: 'execute',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 恢复暂停的任务
    *resume({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { pageData } = yield select((state) => state.job);
      const { status } = yield call(operJob, {
        querys: { jobGroup: record.jobGroup, jobName: record.jobName },
        res: 'resume',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
          payload: { pageData: pageData.startPage(1, 20) },
        });
      }
    },
    // 查看日志
    *getLog({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { status } = yield call(getLogs, record.id);
      if (status) {
        success();
      }
    },

    *getLogPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      const { status, message, data } = yield call(
        getLogPageInfo,
        PageHelper.requestFormat(pageData)
      );
      if (status) {
        const newPageData = objectAssign(
          PageHelper.create(),
          pageData,
          PageHelper.responseFormat({ data })
        );
        yield put({
          type: 'getLogPageInfoSuccess',
          payload: newPageData,
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
    getLogPageInfoSuccess(state, { payload }) {
      return {
        ...state,
        logPageData: payload,
      };
    },
  },
};
