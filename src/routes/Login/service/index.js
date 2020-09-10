import $$ from 'cmn-utils';

export async function login(payload) {
  return $$.post('/v1/users/login', payload);
}