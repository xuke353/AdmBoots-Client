import React from 'react';
import {Switch } from 'antd';
export default () => [
  {
    title: '授权码',
    name: 'code',
    formItem: {rules: [{ required: true}]},
  },
  {
    title: '发件人',
    name: 'fr',
    formItem: {
      rules: [
        {
          required: true,
          message: '请输入邮箱地址！',
        },
        {
          type: 'email',
          message: '邮箱地址格式错误！',
        },
      ],
    },
  },
  {
    title: '发件服务器',
    name: 'frHost',
    formItem: {
      rules: [{ required: true}],
    },
  },
  {
    title: '收件人',
    name: 'to',
    formItem: {
        placeholder: '多个收件人","分割',
        rules: [{ required: true}],
      },
  },
  {
    title: '抄送人',
    name: 'cc',
    formItem: {
        placeholder: '多个抄送人","分割',
      },
  },
  {
    title: '启用通知',
    name: 'notify',
    formItem: {
    type: 'custom',
    render: (record, form) =>
      form.getFieldDecorator('notify', {
        initialValue: record ? record.notify : true,
        valuePropName: 'checked',
      })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />),
    }
  },
];
