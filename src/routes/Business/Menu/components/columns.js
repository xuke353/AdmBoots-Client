import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { Badge, Tag, Tooltip, Switch } from 'antd';
import SliderInput from './SliderInput';
import { formatDateTime } from '@/utils/tool';

const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={`sider-menu-item-img`} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} antd />;
  }
  return icon;
};

export default (self, casOptions) => [
  {
    title: '名称',
    name: 'name',
    tableItem: {
      render: (text, record) => {
        if (record.menuType === 1) {
          return record.icon ? (
            <span>
              {getIcon(record.icon)}
              <span>&nbsp;&nbsp;{text}</span>
            </span>
          ) : (
            text
          );
        } else {
          return text;
        }
      },
    },
    searchItem: {
      group: 'abc',
      placeholder: '',
    },
    formItem: {
      rules: [{ required: true, message: '请输入名称!' }],
    },
  },
  {
    title: '编号',
    name: 'code',
    tableItem: {},
    formItem: {
      rules: [{ required: true, message: '请输入编号!' }],
    },
  },
  {
    title: '类型',
    name: 'menuType',
    dict: [
      { code: 1, codeName: '菜单' },
      { code: 2, codeName: '按钮' },
    ],
    tableItem: {
      render: (text) => {
        return text === 1 ? (
          <Tag color="magenta">菜单</Tag>
        ) : (
          <Tag color="cyan">按钮</Tag>
        );
      },
    },
    formItem: {
      type: 'radio',
      initialValue: 1,
    },
  },
  {
    title: '父级菜单',
    name: 'parentIdList',
    formItem: {
      type: 'cascade',
      options: casOptions,
      changeOnSelect: true,
      allowClear: false,
      rules: [{ required: true, message: '请选择父级菜单!' }],
      fieldNames: { label: 'name', value: 'id', children: 'children' },
    },
  },
  {
    title: '资源标识',
    name: 'uri',
    tableItem: {},
    formItem: {
      rules: [{ required: true, message: '请输入路由或权限标识!' }],
      initialValue: '/',
    },
  },
  {
    title: '菜单图标',
    name: 'icon',
    formItem: {},
  },
  {
    title: '描述',
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
    formItem: {},
  },
  {
    title: '排序',
    name: 'sort',
    tableItem: {},
    formItem: {
      type: 'custom',
      render: (record, form) =>
        form.getFieldDecorator('sort', {
          initialValue: record ? record.sort : 0,
        })(<SliderInput />),
    },
  },
  {
    title: '状态',
    name: 'isActive',
    tableItem: {
      render: (text) => {
        return text ? (
          <Badge status="success" text="激活" />
        ) : (
          <Badge status="error" text="禁用" />
        );
      },
    },
    formItem: {
      type: 'custom',
      render: (record, form) =>
        form.getFieldDecorator('isActive', {
          initialValue: record ? record.isActive : true,
          valuePropName: 'checked',
        })(<Switch checkedChildren="激活" unCheckedChildren="禁用" />),
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
      width: 180,
      render: (text, record) => (
        <DataTable.Oper>
          <Button tooltip="修改" onClick={() => self.handleUpdate(record)}>
            <Icon type="EditOutlined" antd/>
          </Button>
          <Button tooltip="删除" onClick={() => self.onDelete(record)}>
            <Icon type="DeleteOutlined" antd/>
          </Button>
        </DataTable.Oper>
      ),
    },
  },
];
