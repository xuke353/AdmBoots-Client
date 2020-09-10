import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Modal, Tree, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
export default class extends BaseComponent {
  state = {
    record: null,
    visible: false,
    rows: [],
  };

  handleDelete = (records) => {
    const { rows } = this.state;

    this.props.dispatch({
      type: 'menu/remove',
      payload: {
        records,
        success: () => {
          // 如果操作成功，在已选择的行中，排除删除的行
          this.setState({
            rows: rows.filter(
              (item) => !records.some((jtem) => jtem.rowKey === item.rowKey)
            ),
          });
          message.success('操作成功');
        },
      },
    });
  };
  handleUpdate = (record) => {
    this.setState({
      record,
      visible: true,
      currentIsMenu: record.isMenu,
    });
  };

  render() {
    const { menu, loading, dispatch } = this.props;
    const { pageData, cascadeMenus } = menu;
    const { rows, record, visible } = this.state;
    const columns = createColumns(this, cascadeMenus);

    const searchBarProps = {
      columns,
      onSearch: (values) => {
        dispatch({
          type: 'menu/getPageInfo',
          payload: {
            pageData: pageData.filter(values),
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
      showNum: false,
      selectedRowKeys: rows.map((item) => item.rowKey),
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
          type: record ? 'menu/update' : 'menu/save',
          payload: {
            values,
            record,
            success: () => {
              this.setState({
                record: null,
                visible: false,
              });
              message.success('操作成功');
            },
          },
        });
      },
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
        <ModalForm {...modalFormProps} />
      </Layout>
    );
  }
}
