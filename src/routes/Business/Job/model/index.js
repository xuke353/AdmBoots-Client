import PageHelper from '@/utils/pageHelper';
import { getPageInfo, operJob, addJob, getLogPageInfo,updateJob } from '../service';
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
    pageData: {},
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
    *init({ payload },{ call, put}) {
      yield put({
        type: 'getPageInfo',
      });
    },
    // 获取分页数据
    *getPageInfo({ payload }, { call, put }) {
      const { status, data } = yield call(getPageInfo);
      // const newPageData = objectAssign(
      //   PageHelper.create(),
      //   pageData,
      //   PageHelper.responseFormat({ data })
      // );
      if (status) {
        yield put({
          type: 'getPageInfoSuccess',
          payload: {list: data},
        });
      }
    },
    // 保存 之后查询分页
    *save({ payload }, { call, put, select }) {
      const { values, success } = payload;
      const { status } = yield call(addJob, values);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    // 修改
    *update({ payload }, { call, put, select }) {
      const { values, success } = payload;
      const { status } = yield call(updateJob, values);
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    // 删除
    *remove({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { status } = yield call(operJob, {
        data: { groupName: record.groupName, jobName: record.jobName },
        template: 'remove',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    // 暂停任务
    *pause({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { status } = yield call(operJob, {
        data: { groupName: record.groupName, jobName: record.jobName },
        template: 'pause',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    // 立即执行任务
    *execute({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { status } = yield call(operJob, {
        data: { groupName: record.groupName, jobName: record.jobName },
        template: 'run',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    // 恢复暂停的任务
    *resume({ payload }, { call, put, select }) {
      const { record, success } = payload;
      const { status } = yield call(operJob, {
        data: { groupName: record.groupName, jobName: record.jobName },
        template: 'resume',
      });
      if (status) {
        success();
        yield put({
          type: 'getPageInfo',
        });
      }
    },
    //执行记录
    *getLogPageInfo({ payload }, { call, put }) {
      const { pageData } = payload;
      const { status, data } = yield call(
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
