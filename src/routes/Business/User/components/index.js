import React from 'react';
import { connect } from 'dva';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Layout, Button, Modal } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
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
      type: 'user/remove',
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
  onResetPassword = (record) => {
    const content = `您是否要将该用户密码重置为 123456？`;
    const { id } = record;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        this.props.dispatch({
          type: 'user/resetPassword',
          payload: { id },
        });
      },
      onCancel() {},
    });
  };
  render() {
    const { user, loading, dispatch } = this.props;
    const { pageData, roles } = user;
    const columns = createColumns(this, roles);
    const { rows, record, visible } = this.state;

    const searchBarProps = {
      columns,
      onSearch: (values) => {
        dispatch({
          type: 'user/getPageInfo',
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
          type: 'user/getPageInfo',
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
          type: record ? 'user/update' : 'user/save',
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

    return (
      <Layout className="full-layout crud-page">
        <Header>
          <Toolbar
            appendLeft={
              <Button.Group>
                <Button type="primary" icon={<PlusOutlined/>} onClick={this.onAdd}>
                  新增
                </Button>
                <Button
                  disabled={!rows.length}
                  onClick={() => this.onDelete(rows)}
                  icon={<DeleteOutlined/>}
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
      </Layout>
    );
  }
}
