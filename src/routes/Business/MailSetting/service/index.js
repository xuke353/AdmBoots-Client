import $$ from 'cmn-utils';

export async function getPageInfo() {
  return $$.get(`/v1/mailSettings`).catch((e) => {
    //catch阻止dva全局抛错，统一由errorHandle抛错
    return { status: false };
  });
}

export async function add(payload) {
  return $$.post('/v1/mailSettings', payload).catch((e) => {
    return { status: false };
  });
}

