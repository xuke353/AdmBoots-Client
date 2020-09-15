import React from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { Layout, Button, Modal, Tree, Tag } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
import AuthWrapper from 'components/AuthWrapper';
import {PAGE_PATH} from '../index';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

const dig = (data) =>{
  const list = [];
  data.forEach((item) => {
    const treeNode = {
      key: item.id,
      title: item.menuType === 1 ? item.name : <Tag>{item.name}</Tag>
    };
    if (item.children) {
      treeNode.children=dig(item.children)
    }
    list.push(treeNode);
  });
  return list;
}

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
export default class extends BaseComponent {
  state = {
    record: null,
    visible: false,
    distributeModalVisible: false,
    rows: [],
    checkedKeys: [],
  };

  handleDelete = (records) => {
    const { rows } = this.state;

    this.props.dispatch({
      type: 'role/remove',
      payload: {
        records,
        success: () => {
          // 如果操作成功，在已选择的行中，排除删除的行
          this.setState({
            rows: rows.filter(
              (item) => !records.some((jtem) => jtem.id === item.id)
            ),
          });
        },
      },
    });
  };
  /**
   * 分配菜单功能
   */
  onDistribute = (record) => {
    const { menuIds } = record;
    this.setState({
      checkedKeys: menuIds,
      record,
      distributeModalVisible: true,
    });
  };

  render() {
    const { role, loading, dispatch } = this.props;
    const { pageData, menus } = role;
    const columns = createColumns(this);
    const {
      rows,
      record,
      visible,
      distributeModalVisible,
      checkedKeys,
    } = this.state;

    const searchBarProps = {
      columns,
      onSearch: (values) => {
        dispatch({
          type: 'role/getPageInfo',
          payload: {
            pageData: pageData.filter(values).jumpPage(1, 20),
          },
        });
      },
    };

    const dataTableProps = {
      loading,
      columns,
      rowKey: 'id',
      dataItems: pageData,
      selectType: 'checkbox',
      showNum: true,
      isScroll: true,
      selectedRowKeys: rows.map((item) => item.id),
      onChange: ({ pageNum, pageSize }) => {
        dispatch({
          type: 'role/getPageInfo',
          payload: {
            pageData: pageData.jumpPage(pageNum, pageSize),
          },
        });
      },
      onSelect: (keys, rows) => this.setState({ rows }),
    };

    const modalFormProps = {
      loading,
      record,
      visible,
      columns,
      modalOpts: {
        width: 700,
      },
      onCancel: () => {
        this.setState({
          record: null,
          visible: false,
        });
      },
      // 新增、修改都会进到这个方法中，
      // 可以使用主键或是否有record来区分状态
      onSubmit: (values) => {
        const { record } = this.state;
        dispatch({
          type: record ? 'role/update' : 'role/save',
          payload: {
            values,
            record,
            success: () => {
              this.setState({
                record: null,
                visible: false,
              });
            },
          },
        });
      },
    };
    const distributeModalProps = {
      loading,
      record,
      destroyOnClose: true,
      title: '分配功能',
      visible: distributeModalVisible,
      onOk: () => {
        const { record, checkedKeys } = this.state;
        const { id } = record;
        dispatch({
          type: 'role/distributeMenus',
          payload: {
            roleId: id,
            checkedKeys,
            success: () => {
              this.setState({
                record: null,
                distributeModalVisible: false,
              });
            },
          },
        });
      },
      onCancel: () => {
        this.setState({ distributeModalVisible: false });
      },
    };
    const treeProps = {
      checkable: true,
      checkStrictly: true,
      defaultExpandAll: true,
      blockNode: true,
      onCheck: (checkedKeys) => {
        this.setState({ checkedKeys: checkedKeys.checked });
      },
      checkedKeys,
      treeData: dig(menus)
    };

    return (
      <Layout className="full-layout crud-page">
        <Header>
          <Toolbar
            appendLeft={
              <Button.Group>
                <AuthWrapper authorized="add" menuRoute={PAGE_PATH}>
                  <Button type="primary" icon={<PlusOutlined/>} onClick={this.onAdd}>
                    新增
                  </Button>
                </AuthWrapper>
                <AuthWrapper authorized="delete" menuRoute={PAGE_PATH}>
                  <Button
                    disabled={!rows.length}
                    onClick={(e) => this.onDelete(rows)}
                    icon={<DeleteOutlined/>}
                  >
                    删除
                  </Button>
                </AuthWrapper>
              </Button.Group>
            }
          >
            <SearchBar group="abc" {...searchBarProps} />
          </Toolbar>
        </Header>
        <Content>
          <DataTable {...dataTableProps} />
        </Content>
        <Footer>
          <Pagination {...dataTableProps} />
        </Footer>
        <ModalForm {...modalFormProps} />
        <Modal {...distributeModalProps}>
          <Tree {...treeProps}></Tree>
        </Modal>
      </Layout>
    );
  }
}
