import React from 'react';
import { connect } from 'dva';
import { Layout, Button, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Toolbar from 'components/Toolbar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import './index.less';
import LogPage from './LogPage';
import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';
import store from 'cmn-utils/lib/store';

const { Content, Header } = Layout;
const IsDev = process.env.NODE_ENV !== 'production';

@connect(({ job, loading }) => ({
  job,
  loading: loading.models.job,
}))
export default class extends BaseComponent {
  state = {
    record: null,
    visible: false,
    logModalVisible: false,
    preview: false,
  };

  componentDidMount() {
    //连接signalr
    this.FnsignalR();
  }
  FnsignalR = async () =>{     
    const user = store.getStore('user');
    if(user){
      const token = user.accessToken;
      console.log(token, "----token signalr---")
      this.setupSignalRConnection("/api/chathub", token)
    }    
  }

  startSignalRConnection = async connection => {
    try {
        await connection.start();
        console.assert(connection.state === HubConnectionState.Connected);
        console.log('SignalR connection established');
    } catch (err) {
        console.assert(connection.state === HubConnectionState.Disconnected);
        console.error('SignalR Connection Error: ', err);
        setTimeout(() => this.startSignalRConnection(connection), 5000);
    }
};
//SignalRC
setupSignalRConnection = (connectionHub, getAccessToken) => {
    const options = {
        logMessageContent: IsDev,
        logger: IsDev ? LogLevel.Warning : LogLevel.Error,
        accessTokenFactory: () => getAccessToken
    };
    // create the connection instance
    // withAutomaticReconnect will automatically try to reconnect
    // and generate a new socket connection if needed
    const connection = new HubConnectionBuilder()
        .withUrl(connectionHub, options)
        .withAutomaticReconnect()
        .withHubProtocol(new JsonHubProtocol())
        .configureLogging(LogLevel.Information)
        .build();
 
    // Note: to keep the connection open the serverTimeout should be
    // larger than the KeepAlive value that is set on the server
    // keepAliveIntervalInMilliseconds default is 15000 and we are using default
    // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
    connection.serverTimeoutInMilliseconds = 60000;
 
    // re-establish the connection if connection dropped
    connection.onclose(error => {
        console.assert(connection.state === HubConnectionState.Disconnected);
        console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
    });
 
    connection.onreconnecting(error => {
        console.assert(connection.state === HubConnectionState.Reconnecting);
        console.log('Connection lost due to error. Reconnecting.', error);
    });
 
    connection.onreconnected(connectionId => {
        console.assert(connection.state === HubConnectionState.Connected);
        console.log('Connection reestablished. Connected with connectionId', connectionId);
    });
 
    this.startSignalRConnection(connection);
 
    connection.on('hotdata', res => {
        console.log("SignalR get hot res:", JSON.parse(res))
        let resdata = JSON.parse(res)
         
         
    });
 
    return connection;
};

  handleReload = () => {
    this.props.dispatch({
      type: 'job/getPageInfo',
    });
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
  handleMenuClick = (key, record) => {
    switch (key) {
      case 'update':
        this.onUpdate(record);
        break;
      case 'pause':      
          this.props.dispatch({
            type: 'job/pause',
            payload: {
              record,
              success: () => {
                message.success('任务已暂停');
              },
            },
          });       
        break;
      case 'resume':
        this.props.dispatch({
          type: 'job/resume',
          payload: {
            record,
            success: () => {
              message.success('启动成功');
            },
          },
        });
        break;
      case 'execute': 
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
        case 'remove': 
          this.onDelete(record);
        break;
      case 'getLog':
        this.setState({ logModalVisible: true, record });
        break;
      case 'detail':
        this.setState({ preview: true, visible: true, record });
        break;
      default:
        break;
    }
  };
  onClick = jobKey => {
    const { job } = this.props;
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
  onLogPageCancel = () => {
    this.setState({logModalVisible: false});
  }
  render() {
    const { job, loading, dispatch } = this.props;
    const { pageData } = job;
    const {
      record,
      visible,
      logModalVisible,
      preview,
    } = this.state;
    const columns = createColumns(this);

    const dataTableProps = {
      loading,
      columns: columns
        .filter((f) => f.tableItem)
        .filter((t) => !t.tableItem.hide),
      rowKey: 'id',
      dataItems: pageData,
      isScroll: true,
      showNum: true,
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
      columns: createColumns(this, record),
      modalOpts: {
        width: 700,
      },
      preview,
      onCancel: () => {
        this.setState({
          record: null,
          visible: false,
          preview: false,
        });
      },
      // 新增、修改都会进到这个方法中，
      // 可以使用主键或是否有record来区分状态
      onSubmit: preview ? null : (values) => {
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
    const jobKey = record ? `${record.groupName}.${record.jobName}` : '';
    
    return (
      <Layout className="full-layout crud-page">
        <Header>
          <Toolbar
            appendLeft={
              <Button.Group>
              <Button type="primary" icon={<PlusOutlined/>} onClick={this.onAdd}>
                  新增
                </Button>                
              </Button.Group>
            }        
          >
        <Button loading={loading} onClick={() => this.handleReload()} icon={<ReloadOutlined/>}>刷新</Button>
        </Toolbar>
        </Header>
        <Content>
          <DataTable {...dataTableProps} />
        </Content>
        {/* <Footer>
          <Pagination {...dataTableProps} />
        </Footer> */}
        <ModalForm {...modalFormProps}/>

        {logModalVisible ? <LogPage jobKey={jobKey} onCancel={this.onLogPageCancel}/> : null}
      </Layout>
    );
  }
}
