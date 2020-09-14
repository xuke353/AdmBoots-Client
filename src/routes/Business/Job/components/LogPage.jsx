import React from 'react';
import { connect } from 'dva';
import { Layout, Modal } from 'antd';
import DataTable from 'components/DataTable';
import { ReloadOutlined, LoadingOutlined} from '@ant-design/icons';
import createColumns from './logColumns';
import './index.less';
const { Content, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ job, loading }) => ({
  job,
  loading: loading.models.job,
}))
export default class extends React.PureComponent {
  state = {
      icon: <ReloadOutlined/>
  };
  componentDidMount() {
      this.reload();
  }
  reload = () => {
    const { jobKey, job, dispatch } = this.props;
    const { logPageData } = job;
    this.setState({icon: <LoadingOutlined />})
      dispatch({
        type: 'job/getLogPageInfo',
        payload: {
          pageData: logPageData
            .filter({ jobKey })
            .jumpPage(1, 20)
            .sortBy('beginTime desc'),
          success: () => {
            this.setState({icon: <ReloadOutlined />})
          },
        },
      });
  }
  render() {
    const { job, loading, dispatch, jobKey, onCancel } = this.props;
    const { logPageData } = job;
    const columns = createColumns();

    const logTableProps = {
      loading, //这里应该使用自己的loading
      columns,
      rowKey: 'id',
      dataItems: logPageData,
      showNum: true,
      isScroll: true,
      onChange: ({ pageNum, pageSize }) => {
        dispatch({
          type: 'job/getLogPageInfo',
          payload: {
            pageData: logPageData
              .filter({ jobKey })
              .jumpPage(pageNum, pageSize),
          },
        });
      },
    };
   
    const logModalProps = {
      destroyOnClose: true,
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      title: <span>{`调度日志 [${jobKey}]`} <a style={{marginLeft: 10}} onClick={this.reload} title="刷新">{this.state.icon}</a></span>,
      visible: true,
      onCancel,
      footer: null,
      width: '90%',
      style: {top: 10}
    };
    
    return (
      <Modal {...logModalProps}>
        <Layout className="full-layout crud-page">
          <Content>
            <DataTable {...logTableProps} />
          </Content>
          <Footer>
            <Pagination {...logTableProps} />
          </Footer>
        </Layout>
      </Modal>
    );
  }
}
