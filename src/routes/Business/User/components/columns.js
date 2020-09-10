import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { Link } from 'dva/router';
import { Badge, Tooltip } from 'antd';
import { formatDateTime } from '@/utils/tool';

export default (self, roles) => [
  {
    title: '用户名',
    name: 'userName',
    tableItem: {},
    formItem: {
      rules: [{ required: true, message: '请输入用户名!' }],
    },
  },
  {
    title: '姓名',
    name: 'name',
    tableItem: {
      render: (text, r) =>
        r.isMaster ? (
          <span>
            {text}&nbsp;
            <Tooltip title="该用户为超级管理员">
              <Icon type="lock" antd style={{ cursor: 'pointer' }} />
            </Tooltip>
          </span>
        ) : (
          text
        ),
    },
    searchItem: {
      group: 'abc',
      placeholder: '',
    },
    formItem: {
      rules: [{ required: true, message: '请输入姓名!' }],
    },
  },
  {
    title: '角色',
    name: 'roleOfUsers',
    tableItem: {
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: (text) => text.map((item) => item.roleName).join('|'),
    },
    formItem: {
      rules: [{ required: true, message: '请选择角色!' }],
      type: 'transfer',
      modal: true,
      dataSource: roles.map((m) => ({ key: m.roleId, title: m.roleName })),
      normalize: (value) => value.map((item) => item.roleId),
    },
  },
  {
    title: '邮箱',
    name: 'email',
    tableItem: {},
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
    title: '状态',
    name: 'status',
    dict: [
      { code: 1, codeName: '正常' },
      { code: 0, codeName: '无效' },
    ],
    tableItem: {
      render: (text) => {
        return text === 1 ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="default" text="无效" />
        );
      },
    },
    formItem: {
      type: 'radio',
      initialValue: 1,
    },
  },
  {
    title: '创建时间',
    name: 'createTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '最后登录时间',
    name: 'lastLoginTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '操作',
    tableItem: {
      width: 259,
      render: (text, record) => (
        <DataTable.Oper className="col-align-right">
          <Button
            size="small"
            type="primary"
            icon="edit"
            onClick={(e) => self.onUpdate(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            type="danger"
            icon="delete"
            onClick={(e) => self.onDelete(record)}
          >
            删除
          </Button>
          <Button
            size="small"
            type="primary"
            icon="redo"
            onClick={(e) => self.onResetPassword(record)}
          >
            重置密码
          </Button>
        </DataTable.Oper>
      ),
    },
  },
];
