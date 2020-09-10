import React from 'react';
import { Badge, Tooltip } from 'antd';
import { formatDateTime } from '@/utils/tool';

export default () => [
  {
    title: '开始时间',
    name: 'beginTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '结束时间',
    name: 'endTime',
    tableItem: {
      render: (text) => formatDateTime(text, 'YYYY-MM-DD HH:mm'),
    },
  },
  {
    title: '耗时（秒）',
    name: 'seconds',
    tableItem: {},
  },
  {
    title: '消息类型',
    name: 'level',
    tableItem: {
      render: (text) => {
        let status = '';
        switch (text) {
          case '警告':
            status = 'warning';
            break;
          case '消息':
            status = 'success';
            break;
          case '错误':
            status = 'error';
            break;
          default:
            status = 'default';
        }
        return <Badge status={status} text={text} />;
      },
    },
  },
  {
    title: '请求结果',
    name: 'result',
    tableItem: {
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
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
  },
  {
    title: '异常消息',
    name: 'errorMsg',
    tableItem: {
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
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
  },
];
