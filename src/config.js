import React from 'react';
import PageLoading from 'components/Loading/PageLoading';
import { normal, antdNotice } from 'components/Notification';
import store from 'cmn-utils/lib/store';
import { routerRedux } from 'dva/router';
import appIndex from '@/index';

// 系统通知, 定义使用什么风格的通知，normal或antdNotice
const notice = antdNotice;

/**
 * 应用配置 如请求格式，反回格式，异常处理方式，分页格式等
 */
export default {
  /**
   * HTML的title模板
   */
  htmlTitle: 'AdmBoots - {title}',
  
  /**
   * 系统通知
   */
  notice,

  // 异步请求配置
  request: {
    prefix: '/api',

    // 每次请求头部都会带着这些参数
    withHeaders: () => {
      const user = store.getStore('user');
      return user ? { Authorization: 'Bearer ' + user.accessToken } : null;
    },

    /**
     * 因为modelEnhance需要知道服务器反回的数据，
     * 什么样的是成功，什么样的是失败，如
     * {status: true, data: ...} // 代表成功
     * {status: false, message: ...} // 代表失败
     * 实际中应该通过服务端反回的response中的
     * 成功失败标识来进行区分
     */
    afterResponse: response => {
      const { status, message } = response;
      if (status) {
        return response;
      } else {
        throw new Error(message);
      }
    },
    errorHandle: err => {
       // 请求错误全局拦截
       if (err.name === 'RequestError') {
        if (err.code === 401) {
          const { dispatch } = appIndex;
          dispatch(routerRedux.replace('/sign/login'));
          //return subscriberPromise(info);
        } else if (err.code === 403) {
          notice.error('抱歉，您无权访问该资源');
        } else {
          notice.error(err.text || err.message);
        }
      }
    },
  },

  // 全局异常
  exception: {
    global: (err, dispatch) => {
      const errName = err.name;
      if (err.code === 401) {
        notice.error('令牌失效，请重新登陆');
        return;
      }
      // RequestError为拦截请求异常
      if (errName === 'RequestError') {
        notice.error(err.message);
        console.error(err); 
      } else {
        console.error(err);
      }
    },
  },

  // 分页助手
  pageHelper: {
    // 格式化要发送到后端的数据
    requestFormat: pageInfo => {
      const { pageNum, pageSize, filters, sorts } = pageInfo;
      return {
        pageIndex: pageNum,
        pageSize: pageSize,
        sortField: sorts,
        ...filters,
      };
    },

    // 格式化从后端反回的数据
    responseFormat: resp => {
      const {
        pageIndex,
        pageSize,
        totalElements,
        content,
        totalPages,
      } = resp.data;
      return {
        pageNum: pageIndex,
        pageSize: pageSize,
        total: totalElements,
        totalPages: totalPages,
        list: content,
      };
    }
  },

  // 路由加载效果
  router: {
    loading: <PageLoading loading />
  },

  /**
   * 模拟数据时包装反回数据
   * 因为，后端反回数据时一般都会在外边包装一层状态信息
   * 如成功时：
   * {
   *   status: true,
   *   data: responseData
   * }
   * 或出错时：
   * {
   *   status: false,
   *   code: 500,
   *   message: '用户名或密码错误'
   * }
   * 这里就是配置这两个函数，为了我们模拟数据时可以少写几行代码的 orz...
   */
  mock: {
    toSuccess: response => ({
      status: true,
      data: response
    }),

    toError: message => ({
      status: false,
      message: message
    })
  }
};
