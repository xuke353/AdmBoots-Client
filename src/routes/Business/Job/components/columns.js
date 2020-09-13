import React from 'react';
import DataTable from 'components/DataTable';
import Button from 'components/Button';
import { Badge, Tooltip, Dropdown, Menu } from 'antd';
import { formatDateTime } from '@/utils/tool';
import { DownOutlined} from '@ant-design/icons';

export default (self, isUpdating) => [
  {
    title: '作业名称',
    name: 'jobName',
    tableItem: {},
    searchItem: {
      group: 'abc',
      placeholder: '',
    },
    formItem: {
      disabled: isUpdating,
      rules: [{ required: true}],
    },
  },
  {
    title: '组名',
    name: 'groupName',
    tableItem: {},
    formItem: {
      disabled: isUpdating,
      rules: [{ required: true}],
    },
  },
  {
    title: 'Cron表达式',
    name: 'cron',
    tableItem: {},
    formItem: {
      rules: [{ required: true}],
    },
  },
  {
    title: '状态',
    name: 'status',
    tableItem: {
      render: (t) => {
        let status = '';
        let text ='';
        switch (t) {
          case 0:
            status = 'processing';
            text = '正常';
            break;
          case 1:
            status = 'warning';
            text = '暂停';
            break;
          case 2:
            status = 'success';
            text = '完成';
            break;
          case 3:
            status = 'error';
            text = '错误';
            break;
          case 4:
            status = 'error';
            text = '阻塞';
            break;
          case 5:
            status = 'default';
            text = '不存在';
            break;
          default:
            text = '未启动';
            status = 'default';
        }
        return <Badge status={status} text={text} />;
      },
    },
  },
  {
    title: '最后执行时间',
    name: 'previousFireTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '下次执行时间',
    name: 'nextFireTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '请求地址',
    name: 'requestUrl',
    tableItem: { hide: true },
    formItem: {},
  },
  {
    title: '请求类型',
    name: 'requestType',
    dict: [
      { code: 1, codeName: 'Get' },
      { code: 2, codeName: 'Post' },
      { code: 4, codeName: 'Put' },
      { code: 8, codeName: 'Delete' },
    ],
    tableItem: { hide: true },
    formItem: {
      type: 'radio',
      initialValue: 1,
    },
  },
  {
    title: '请求头',
    name: 'headers',
    tableItem: { hide: true },
    formItem: {
      type: 'textarea',
      placeholder: '格式：{"Authorization":"userpassword.."}',
    },
  },
  {
    title: '请求参数',
    name: 'requestParams',
    tableItem: { hide: true },
    formItem: {
      type: 'textarea',
      placeholder: 'Json字符串（Post，Put请求用）',
    },
  },
  {
    title: '任务描述',
    name: 'describe',
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
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    formItem: { type: 'textarea' },
  },
  {
    title: '操作',
    tableItem: {
      width: 180,
      render: (text, record) => (
        <DataTable.Oper className="col-align-right">
          <Button
            size="small"
            type="primary"
            onClick={() => self.handleMenuClick('getLog', record)}>
            执行记录
          </Button>
          <Dropdown overlay={<Menu onClick={({item, key}) => self.handleMenuClick(key, record)}>
                              {record.options.some(s => s === 'pause') ? <Menu.Item key="pause">暂停任务</Menu.Item> : null}
                              {record.options.some(s => s === 'resume') ? <Menu.Item key="resume">开启任务</Menu.Item> : null}
                              {record.options.some(s => s === 'execute') ? <Menu.Item key="execute">立即执行</Menu.Item> : null}
                              <Menu.Item key="update">修改任务</Menu.Item>
                              <Menu.Item key="remove">删除任务</Menu.Item>
                              <Menu.Item key="detail">任务详情</Menu.Item>
                            </Menu>} trigger={['click']}>
          <Button size="small" type="primary">
            操作 <DownOutlined />
          </Button>
        </Dropdown>
        </DataTable.Oper>
      ),
  },
},
];
