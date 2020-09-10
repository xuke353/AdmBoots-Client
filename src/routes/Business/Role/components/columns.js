import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import AuthWrapper from 'components/AuthWrapper';
import { Link } from 'dva/router';
import { formatDateTime } from '@/utils/tool';

export default (self) => [
  {
    title: '角色名称',
    name: 'name',
    tableItem: {},
    searchItem: {
      group: 'abc',
    },
    formItem: {
      rules: [{ required: true, message: '请输入角色名称!' }],
    },
  },
  {
    title: '角色编号',
    name: 'code',
    tableItem: {},
    formItem: {
      rules: [{ required: true, message: '请输入角色编号!' }],
    },
  },
  {
    title: '描述',
    name: 'description',
    tableItem: {},
    formItem: {
      type: 'textarea',
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
    title: '操作',
    tableItem: {
      width: 240,
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
          <AuthWrapper authorized="delete" menuRoute="/role">
            <Button
              size="small"
              type="danger"
              icon="delete"
              onClick={(e) => self.onDelete(record)}
            >
              删除
            </Button>
          </AuthWrapper>
          <Button
            size="small"
            type="primary"
            icon="lock"
            onClick={(e) => self.onDistribute(record)}
          >
            权限
          </Button>
        </DataTable.Oper>
      ),
    },
  },
];
