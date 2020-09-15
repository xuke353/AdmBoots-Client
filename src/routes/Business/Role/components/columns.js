import React from 'react';
import { EditOutlined,UnlockOutlined, DeleteOutlined } from '@ant-design/icons';
import DataTable from 'components/DataTable';
import Button from 'components/Button';
import AuthWrapper from 'components/AuthWrapper';
import { formatDateTime } from '@/utils/tool';
import {PAGE_PATH} from '../index';

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
          <AuthWrapper authorized="update" menuRoute={PAGE_PATH}>
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => self.onUpdate(record)}
            >
              编辑
            </Button>
          </AuthWrapper>
          <AuthWrapper authorized="delete" menuRoute={PAGE_PATH}>
            <Button
              size="small"
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => self.onDelete(record)}
            >
              删除
            </Button>
          </AuthWrapper>
          <AuthWrapper authorized="auth" menuRoute={PAGE_PATH}>
            <Button
              size="small"
              type="primary"
              icon={<UnlockOutlined />}
              onClick={() => self.onDistribute(record)}
            >
              权限
            </Button>
          </AuthWrapper>
        </DataTable.Oper>
      ),
    },
  },
];
