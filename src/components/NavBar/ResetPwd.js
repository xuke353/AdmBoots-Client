import React, { Component } from 'react';
import { connect } from 'dva';
import $$ from 'cmn-utils';
import { routerRedux } from 'dva/router';
import { Input, Button, Popover, Progress, Layout, Form } from 'antd';
import './style/resetpwd.less';
import { antdNotice } from 'components/Notification';
const notice = antdNotice;

const { Content } = Layout;

const passwordStatusMap = {
  ok: <div style={{ color: '#52c41a' }}>强度：强</div>,
  pass: <div style={{ color: '#faad14' }}>强度：中</div>,
  poor: <div style={{ color: '#f5222d' }}>强度：太短</div>
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

@connect()
export default class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
    submitting: false
  };
  componentWillUnmount() {
    this.unmount = true;
  }

  getPasswordStatus = () => {
    if (!this.form) {
      return;
    }
    const value = this.form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = values => {
    const { dispatch, onClose } = this.props;
    this.setState({ submitting: true });
    $$.put('/v1/users/modifyPwd', { ...values })
        .then((res) => {
            notice.success(res.message);
            onClose();
            dispatch(routerRedux.replace('/sign/login'));
        })
        .catch((e) => console.error(e));
        if (!this.unmount) {
            this.setState({ submitting: false });
        }
  };

  checkConfirm = (rule, value) => {
    if (value && value !== this.form.getFieldValue('password')) {
      this.setState({ confirmDirty: value });
      return Promise.reject('两次输入的密码不匹配!');
    } else {
      return Promise.resolve();
    }
  };

  checkPassword = (rule, value) => {
    if (!value) {
      this.setState({
        visible: !!value
      });
      return Promise.reject('请输入密码！');
    } else {
      this.setState({
        help: ''
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 6) {
        return Promise.reject('');
      } else {
        if (value && confirmDirty) {
          this.form.validateFields(['confirm'], { force: true });
        }
        return Promise.resolve();
      }
    }
  };


  renderPasswordProgress = () => {
    if (!this.form) {
      return;
    }
    const value = this.form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <Progress
        status={passwordProgressMap[passwordStatus]}
        className={`progress-${passwordStatus}`}
        strokeWidth={6}
        percent={value.length * 10 > 100 ? 100 : value.length * 10}
        showInfo={false}
      />
    ) : null;
  };

  render() {
    const { user } = this.props;
    const { help, visible, submitting } = this.state;

    return (
      <Layout className="full-layout register-page resetpwd-page">
        <Content>
          <Form ref={node => this.form = node} onFinish={this.handleSubmit} className="login-form">
          <div className="user-name">
              <span>{user.name}</span>
            </div>
            <Form.Item name="current" rules={[
              {
                required: true,
                message: '请输入当前密码'
              }
            ]}>
              <Input size="large" placeholder="当前密码" type="password"/>
            </Form.Item>
            <Form.Item>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                <Form.Item name="password" help={help} noStyle rules={[
                  {
                    validator: this.checkPassword
                  }
                ]}>
                  <Input
                    size="large"
                    type="password"
                    placeholder="至少6位密码，区分大小写"
                  />
                </Form.Item>
              </Popover>
            </Form.Item>
            <Form.Item name="confirm" rules={[
              {
                required: true,
                message: '请确认密码！'
              },
              {
                validator: this.checkConfirm
              }
            ]}>
              <Input size="large" type="password" placeholder="确认密码" />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                loading={submitting}
                className="register-form-button"
                type="primary"
                htmlType="submit"
              >
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    );
  }
}
