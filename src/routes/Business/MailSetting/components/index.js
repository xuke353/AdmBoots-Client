import React from 'react';
import { connect } from 'dva';
import { Layout, Spin, Card, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Form from 'components/Form';
import createColumns from './columns';
const { Content } = Layout;


@connect(({ mailSetting, loading }) => ({
  mailSetting,
  loading: loading.models.mailSetting,
}))
export default class extends BaseComponent {
  state = {};

  onSubmit = (values) => {
    this.props.dispatch({
        type: 'mailSetting/save',
        payload: {
          values,
          success: () => {
            message.success('操作成功');
          },
        },
      });
  }
  render() {
    const { mailSetting, loading } = this.props;
    const { data } = mailSetting;
    const columns = createColumns(this);

    return (
      <Layout className="full-layout crud-page">
        <Content>
            <Spin tip="加载中..." spinning={!!loading}>
                <Card>
                    <div style={{width: 600}}>
                    <Form columns={columns} record={data} onSubmit={this.onSubmit} />
                    </div>                
                </Card>                
            </Spin>
        </Content>
      </Layout>
    );
  }
}
