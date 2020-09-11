import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import $$ from 'cmn-utils';

/**
 * 校验当前用户是否有功能编码对应的权限
 * @param {string} authorized
 */
export function checkAuth(authorized, menuRoute) {
  const permissionList = $$.getStore('permission');
  return permissionList ? permissionList.some(
    (p) => p.uri === menuRoute && p.code === authorized
  ) : false;
}

/**
 * 权限组件封装
 */
class AuthWrapper extends PureComponent {
  render() {
    return (
      checkAuth(this.props.authorized, this.props.menuRoute) &&
      this.props.children
    );
  }
}

AuthWrapper.propTypes = {
  authorized: PropTypes.string,
  menuRoute: PropTypes.string,
};

export default AuthWrapper;
