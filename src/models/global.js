import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';

export default modelEnhance({
  namespace: 'global',

  state: {
    menu: [],
    flatMenu: [],
  },

  effects: {
    *getMenu({ payload }, { call, put }) {
      const { status, data } = yield call(getMenu, payload);
      if (status) {
        const loopMenu = (menu, pitem = {}) => {
          menu.forEach(item => {
            if (pitem.path) {
              item.parentPath = pitem.parentPath ? pitem.parentPath.concat(pitem.path) : [pitem.path];
            }
            if (item.children && item.children.length) {
              loopMenu(item.children, item);
            }
          });
        }
        loopMenu(data);
        
        yield put({
          type: 'getMenuSuccess',
          payload: data,
        });
      }
    },
    *getPermission({ payload }, { call, put }) {
      const { status, data } = yield call(getPermission, payload);
      if (status) {
        $$.setStore('permission', data);
      }
    },
  },

  reducers: {
    getMenuSuccess(state, { payload }) {
      return {
        ...state,
        menu: payload,
        flatMenu: getFlatMenu(payload),
      };
    }
  },
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}

export async function getMenu(payload) {
  return $$.post('/v1/menus/roleMenus', payload).catch((e) => {
    return { status: false };
  });
}

export async function getPermission(payload) {
  return $$.get('/v1/users/permission', payload).catch((e) => {
    return { status: false };
  });
}