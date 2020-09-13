import $$ from 'cmn-utils';

export async function getPageInfo() {
  return $$.get(`/v1/jobs`).catch((e) => {
    //catch阻止dva全局抛错，统一由errorHandle抛错
    return { status: false };
  });
}

export async function addJob(payload) {
  return $$.post('/v1/jobs', payload).catch((e) => {
    return { status: false };
  });
}

export async function updateJob(payload) {
  return $$.put('/v1/jobs/update', payload).catch((e) => {
    return { status: false };
  });
}

export async function operJob(payload) {
  const { data, template } = payload;
  return $$.put('/v1/jobs/' + template, data).catch((e) => {
    return { status: false };
  });
}

export async function getLogPageInfo(payload) {
  return $$.get('/v1/jobs/logs', payload).catch((e) => {
    return { status: false };
  });
}
