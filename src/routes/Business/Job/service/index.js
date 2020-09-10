import $$ from 'cmn-utils';
import { stringify } from '@/utils/tool';

export async function getPageInfo(payload) {
  return $$.get(`/v1/jobs/getAllJob?${stringify(payload)}`).catch((e) => {
    //catch阻止dva全局抛错，统一由errorHandle抛错
    return { status: false };
  });
}

export async function addJob(payload) {
  return $$.post('/v1/jobs/addJob', payload).catch((e) => {
    return { status: false };
  });
}

export async function operJob(payload) {
  const { querys, res } = payload;
  return $$.put('/v1/jobs/' + res, querys).catch((e) => {
    return { status: false };
  });
}

export async function getLogPageInfo(payload) {
  return $$.get('/v1/jobs/getLog', payload).catch((e) => {
    return { status: false };
  });
}
