import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import DataTable from 'components/DataTable';
import createColumns from './logColumns';
import './index.less';
const { Content, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ job, loading }) => ({
  job,
  loading: loading.models.job,
}))
export default class extends React.PureComponent {
  state = {};
  componentDidMount() {
    const { jobKey, job } = this.props;
    const { logPageData } = job;
    this.props.dispatch({
      type: 'job/getLogPageInfo',
      payload: {
        pageData: logPageData
          .filter({ jobKey })
          .jumpPage(1, 20)
          .sortBy('beginTime desc'),
      },
    });
  }

  render() {
    const { job, loading, dispatch, jobKey } = this.props;
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
    return (
      <Layout className="full-layout crud-page">
        <Content>
          <DataTable {...logTableProps} />
        </Content>
        <Footer>
          <Pagination {...logTableProps} />
        </Footer>
      </Layout>
    );
  }
}
