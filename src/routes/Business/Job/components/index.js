import React from 'react';
import { connect } from 'dva';
import { Layout, Button, message, Modal } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
import LogPage from './LogPage';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ job, loading }) => ({
  job,
  loading: loading.models.job,
}))
export default class extends BaseComponent {
  state = {
    record: null,
    visible: false,
    expandedRowKeys: [],
    triggerType: 1,
    logModalVisible: false,
  };

  handleDelete = (records) => {
    this.props.dispatch({
      type: 'job/remove',
      payload: {
        record: records[0],
        success: () => {
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
      triggerType: record.triggerType,
    });
  };

  triggerTypeChange = (value) => {
    this.setState({ triggerType: value });
  };

  handleMenuClick = (key, record) => {
    switch (key) {
      case 'update':
        this.handleUpdate(record);
        break;
      case 'start':
        {
          this.props.dispatch({
            type: 'job/start',
            payload: {
              record,
              success: () => {
                message.success('任务已开启');
              },
            },
          });
        }
        break;
      case 'pause':
        {
          this.props.dispatch({
            type: 'job/pause',
            payload: {
              record,
              success: () => {
                message.success('任务已暂停');
              },
            },
          });
        }
        break;
      case 'resume':
        this.props.dispatch({
          type: 'job/resume',
          payload: {
            record,
            success: () => {
              message.success('任务已恢复');
            },
          },
        });
        break;
      case 'execute': {
        this.props.dispatch({
          type: 'job/execute',
          payload: {
            record,
            success: () => {
              message.success('执行成功');
            },
          },
        });

        break;
      }
      case 'getLog':
        this.setState({ logModalVisible: true, record });
        break;
    }
  };
  render() {
    const { job, loading, dispatch } = this.props;
    const { pageData } = job;
    const {
      record,
      visible,
      expandedRowKeys,
      triggerType,
      logModalVisible,
    } = this.state;
    const columns = createColumns(this, triggerType);

    const searchBarProps = {
      columns,
      onSearch: (values) => {
        dispatch({
          type: 'job/getPageInfo',
          payload: {
            pageData: pageData.filter(values).jumpPage(1, 20),
          },
        });
      },
    };
    const expandedTableProps = {
      columns: columns
        .filter((f) => f.tableItem)
        .filter((t) => t.tableItem.hide),
      rowKey: 'id',
      dataItems: pageData,
      alternateColor: false,
      className: 'table-row',
    };
    const expandedRowRender = (record) => {
      const expandedData = { list: [record] };
      return <DataTable {...expandedTableProps} dataItems={expandedData} />;
    };
    const dataTableProps = {
      loading,
      columns: columns
        .filter((f) => f.tableItem)
        .filter((t) => !t.tableItem.hide),
      rowKey: 'id',
      dataItems: pageData,
      isScroll: true,
      alternateColor: false,
      className: 'table-row',
      expandedRowRender: expandedRowRender,
      onExpand: (expanded, record) => {
        if (expanded) {
          this.setState({ expandedRowKeys: [record.id] });
        } else {
          this.setState({ expandedRowKeys: [] });
        }
      },
      expandedRowKeys,
      onChange: ({ pageNum, pageSize }) => {
        dispatch({
          type: 'job/getPageInfo',
          payload: {
            pageData: pageData.jumpPage(pageNum, pageSize),
          },
        });
      },
    };
    const modalFormProps = {
      loading,
      record,
      visible,
      columns: columns
        .filter((f) => f.formItem)
        .filter((t) => !t.formItem.disabled),
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
          type: record ? 'job/update' : 'job/save',
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
    const logModalProps = {
      destroyOnClose: true,
      title: `调度日志 [${record ? record.jobGroup : ''}.${
        record ? record.jobName : ''
      }]`,
      visible: logModalVisible,
      onCancel: () => {
        this.setState({ logModalVisible: false });
      },
      footer: null,
      width: '90%',
    };
    const jobKey = record ? `${record.jobGroup}.${record.jobName}` : '';
    return (
      <Layout className="full-layout crud-page">
        <Header>
          <Toolbar
            appendLeft={
              <Button.Group>
                <Button type="primary" icon="plus" onClick={this.onAdd}>
                  新增
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
        <Modal {...logModalProps}>
          <LogPage jobKey={jobKey} />
        </Modal>
      </Layout>
    );
  }
}
