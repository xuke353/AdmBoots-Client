import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Modal, Tree, Tag } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;
const TreeNode = Tree.TreeNode;

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
              (item) => !records.some((jtem) => jtem.rowKey === item.rowKey)
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

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <span>
                <span>{item.name}</span>
                <span style={{ float: 'right' }}>
                  {item.menuType === 1 ? (
                    <Tag color="magenta">菜单</Tag>
                  ) : (
                    <Tag color="cyan">按钮</Tag>
                  )}
                </span>
              </span>
            }
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <span>
              <span>{item.name}</span>
              <span style={{ float: 'right' }}>
                {item.menuType === 1 ? (
                  <Tag color="magenta">菜单</Tag>
                ) : (
                  <Tag color="cyan">按钮</Tag>
                )}
              </span>
            </span>
          }
          key={item.id}
          dataRef={item}
        />
      );
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
      selectedRowKeys: rows.map((item) => item.rowKey),
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
        const { checked } = checkedKeys;
        dispatch({
          type: 'role/distributeMenus',
          payload: {
            roleId: id,
            checkedKeys: checked,
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
        this.setState({ checkedKeys });
      },
      checkedKeys,
    };

    return (
      <Layout className="full-layout crud-page">
        <Header>
          <Toolbar
            appendLeft={
              <Button.Group>
                <Button type="primary" icon="plus" onClick={this.onAdd}>
                  新增
                </Button>
                <Button
                  disabled={!rows.length}
                  onClick={(e) => this.onDelete(rows)}
                  icon="delete"
                >
                  删除
                </Button>
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
          <Tree {...treeProps}>{this.renderTreeNodes(menus)}</Tree>
        </Modal>
      </Layout>
    );
  }
}
