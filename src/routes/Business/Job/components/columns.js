import React from 'react';
import DataTable from 'components/DataTable';
import Button from 'components/Button';
import { Link } from 'dva/router';
import { Badge, Tooltip, Icon, Dropdown, Menu } from 'antd';
import { formatDateTime } from '@/utils/tool';
import moment from 'moment';

export default (self, triggerType) => [
  {
    title: '任务名称',
    name: 'jobName',
    tableItem: {},
    searchItem: {
      group: 'abc',
      placeholder: '',
    },
    formItem: {
      rules: [{ required: true, message: 'Please input 任务名称!' }],
    },
  },
  {
    title: '任务组名',
    name: 'jobGroup',
    tableItem: {},
    formItem: {
      rules: [{ required: true, message: 'Please input 任务组名!' }],
    },
  },
  {
    title: '开始时间',
    name: 'beginTime',
    tableItem: {
      hide: true,
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    formItem: {
      type: 'datetime',
      showTime: true,
    },
  },
  {
    title: '结束时间',
    name: 'endTime',
    tableItem: {
      hide: true,
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
    formItem: {
      type: 'datetime',
      showTime: true,
    },
  },
  {
    title: '触发类型',
    name: 'triggerType',
    dict: [
      { code: 1, codeName: 'Cron' },
      { code: 2, codeName: 'Simple' },
    ],
    tableItem: { hide: true },
    formItem: {
      type: 'select',
      initialValue: 1,
      onChange: (form, value) => self.triggerTypeChange(value),
    },
  },
  {
    title: 'Cron表达式',
    name: 'cron',
    tableItem: { hide: true },
    formItem: {
      disabled: triggerType === 2,
      rules: [{ required: true, message: 'Please input 执行间隔!' }],
    },
  },
  {
    title: '状态',
    name: 'displayState',
    tableItem: {
      render: (text) => {
        let status = '';
        switch (text) {
          case '正常':
            status = 'processing';
            break;
          case '暂停':
            status = 'warning';
            break;
          case '完成':
            status = 'success';
            break;
          case '异常':
            status = 'error';
            break;
          case '阻塞':
            status = 'error';
            break;
          case '不存在':
            status = 'default';
            break;
          default:
            status = 'default';
        }
        return <Badge status={status} text={text} />;
      },
    },
  },
  {
    title: '上次执行时间',
    name: 'previousFireTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '执行间隔',
    name: 'intervalSecond',
    tableItem: { hide: true },
    formItem: {
      type: 'number',
      rules: [{ required: true, message: 'Please input 执行间隔!' }],
      placeholder: '请输入执行间隔，单位：秒',
      min: 1,
      disabled: triggerType === 1,
    },
  },
  {
    title: 'Job间隔',
    name: 'interval',
    tableItem: { hide: true },
  },
  {
    title: '下次执行时间',
    name: 'nextFireTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },

  {
    title: '执行次数',
    name: 'runTimes',
    tableItem: { hide: true },
    formItem: {
      type: 'number',
      placeholder: '请输入执行次数，0不限制次数',
      rules: [{ required: true, message: 'Please input 执行间隔!' }],
      disabled: triggerType === 1,
      initialValue: 0,
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
      placeholder: '格式：{"Authorization":"userpassword.."}',
    },
  },
  {
    title: '请求参数',
    name: 'requestParameters',
    tableItem: { hide: true },
    formItem: {
      type: 'textarea',
      placeholder: 'Json字符串（Post，Put请求用）',
    },
  },
  {
    title: '任务描述',
    name: 'description',
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
      width: 150,
      render: (text, record) => {
        const menus = [
          {
            id: 'start',
            children: (
              <a
                key="start"
                onClick={(e) => self.handleMenuClick('start', record)}
              >
                启动
              </a>
            ),
            hidden: !record.options.includes('start'),
          },
          {
            id: 'resume',
            children: (
              <a
                key="resume"
                onClick={(e) => self.handleMenuClick('resume', record)}
              >
                恢复
              </a>
            ),
            hidden: !record.options.includes('resume'),
          },
          {
            id: 'pause',
            children: (
              <a
                key="pause"
                onClick={(e) => self.handleMenuClick('pause', record)}
              >
                暂停
              </a>
            ),
            hidden: !record.options.includes('pause'),
          },
          {
            id: 'execute',
            children: (
              <a
                key="execute"
                onClick={(e) => self.handleMenuClick('execute', record)}
              >
                执行
              </a>
            ),
            hidden: !record.options.includes('execute'),
          },
          {
            id: 'update',
            children: (
              <a
                key="update"
                onClick={(e) => self.handleMenuClick('update', record)}
              >
                修改
              </a>
            ),
            hidden: !record.options.includes('update'),
          },
          {
            id: 'remove',
            children: (
              <a key="remove" onClick={() => self.onDelete(record)}>
                删除
              </a>
            ),
            hidden: !record.options.includes('remove'),
          },
          {
            id: 'getLog',
            children: (
              <a
                key="getLog"
                onClick={(e) => self.handleMenuClick('getLog', record)}
              >
                日志
              </a>
            ),
          },
        ];
        return (
          // <DropdownMenu
          //   key={record.id}
          //   menus={menus}
          //   primaryLength={2}
          //   id={record.id}
          // />
          <a>aa</a>
        );
        // <DataTable.Oper>
        //   <Button
        //     hidden={!record.options.includes('start')}
        //     size="small"
        //     onClick={(e) => self.handleMenuClick('start', record)}
        //   >
        //     启动
        //   </Button>
        //   <Button
        //     hidden={!record.options.includes('resume')}
        //     size="small"
        //     onClick={(e) => self.handleMenuClick('resume', record)}
        //   >
        //     恢复
        //   </Button>
        //   <Button
        //     hidden={!record.options.includes('pause')}
        //     size="small"
        //     onClick={(e) => self.handleMenuClick('pause', record)}
        //   >
        //     暂停
        //   </Button>
        //   <Dropdown
        //     overlay={
        //       <Menu onClick={(e) => self.handleMenuClick(e.key, record)}>
        //         {record.options.includes('execute') ? (
        //           <Menu.Item key="execute">执行</Menu.Item>
        //         ) : (
        //           <div></div>
        //         )}
        //         {record.options.includes('update') ? (
        //           <Menu.Item key="update">修改</Menu.Item>
        //         ) : (
        //           <div></div>
        //         )}
        //         {record.options.includes('remove') ? (
        //           <Menu.Item key="delete">删除</Menu.Item>
        //         ) : (
        //           <div></div>
        //         )}
        //         <Menu.Item key="getLog">日志</Menu.Item>
        //       </Menu>
        //     }
        //   >
        //     <Button>
        //       更多 <Icon type="down" />
        //     </Button>
        //   </Dropdown>
        // </DataTable.Oper>
      },
    },
  },
];
