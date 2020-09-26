import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import $$ from 'cmn-utils';

/**
 * 校验当前用户是否有功能编码对应的权限
 * @param {string} authorized
 */
export function checkAuth(authorized, pageCode) {
  const permissionList = $$.getStore('permission');
  return permissionList ? permissionList.some(
    (p) => p.pageCode === pageCode && p.btnCode === authorized
  ) : false;
}

/**
 * 权限组件封装
 */
class AuthWrapper extends PureComponent {
  render() {
    return (
      checkAuth(this.props.authorized, this.props.pageCode) &&
      this.props.children
    );
  }
}

AuthWrapper.propTypes = {
  authorized: PropTypes.string,
  pageCode: PropTypes.string,
};

export default AuthWrapper;
