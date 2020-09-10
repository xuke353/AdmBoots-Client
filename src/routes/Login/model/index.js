import { routerRedux } from 'dva';
import { login } from '../service';
import $$ from 'cmn-utils';

export default {
  namespace: 'login',

  state: {
    loggedIn: false,
    message: '',
    user: {}
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/sign/login') !== -1) {
          $$.removeStore('user');
          $$.removeStore('expireDate');
          $$.removeStore('permission');
        }
      });
    }
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const { status, message, data } = yield call(login, payload);
        if (status) {
          $$.setStore('user', data);
          const curTime = new Date();
          const expireDate = new Date(
            curTime.setSeconds(curTime.getSeconds() + data.expireInSeconds)
          );
          $$.setStore('expireDate', expireDate);
          yield put(routerRedux.replace('/'));
        } else {
          yield put({
            type: 'loginError',
            payload: { message }
          });
        }
      } catch (e) {
        console.log(e)
        yield put({
          type: 'loginError',
          payload: { message: e.message }
        });
      }
    },
    *logout(_, { put }) { }
  },

  reducers: {
    loginSuccess(state, { payload }) {
      return {
        ...state,
        loggedIn: true,
        message: '',
        user: payload
      };
    },
    loginError(state, { payload }) {
      return {
        ...state,
        loggedIn: false,
        message: payload.message
      };
    }
  }
};
