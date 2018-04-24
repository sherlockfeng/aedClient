import React, { Component } from 'react';
import Head from '../head/head'
import './admin.css';
import { Layout, Icon, Table, Divider, Button, Modal, Input, Spin } from 'antd';
import  {Fetch, Notification } from '../util'
import  {Url } from '../lib'
import UserInfo from '../userInfo/userInfo'

const { Header, Sider, Content } = Layout;
const idToText = { 0: '管理员', 1: '普通用户'}
const textToId = { '管理员': 0, '普通用户': 1}

class Admin extends Component {

  handleList = (data) => {
    let list = data.data
    list.forEach((item, index) => {
      list[index].key = index
      list[index].status = idToText[list[index].status]
      list[index].username = decodeURIComponent(item.username)
      list[index].password = decodeURIComponent(item.password)
    })
    this.setState({
      data: list,
      confirmLoading: false
    })
  }

  componentWillMount = () =>{
    Fetch(Url.adminInfo, {}).then((data) => {
      this.handleList(data)
    }).catch((err) => {
      Notification('error', err.toString(), '', 1)
      this.setState({
        confirmLoading: false
      })
    })
  }

  state = {
    collapsed: false,
    columns: [{
      title: '登录账号',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '用户类型',
      dataIndex: 'status',
      key: 'status',
      
    }, {
      title: '操作时间',
      dataIndex: 'updatetime',
      key: 'updatetime',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <span onClick={this.showModal.bind(this, 'modifyVisible', text)} style={{color: '#1890ff', cursor:'pointer'}}>编辑</span>
          {textToId[text.status] === 0 ?'' : <Divider type="vertical" />}
          {textToId[text.status] === 0 ? '' : <span onClick={this.showModal.bind(this, 'deleteVisible', text)} style={{color: '#1890ff', cursor:'pointer'}}>删除</span>}
          <Divider type="vertical" />
          <span onClick={this.rePassword.bind(this, text)} style={{color: '#1890ff', cursor:'pointer'}}>重置密码</span>
        </span>
      ),
    }],
    data : [],

    modifyVisible: false,
    confirmLoading: false,

    username:'',
    passwordValue:'',

    deleteVisible: false,

    newVisible: false,

    selectValue:{},

    finalValue:{}

  };

  rePassword = (value) => {
    let params = {
      username: '',
      password: '123456',
      id: value._id
    }
    this.setState({
      modifyVisible: true,
    })
    Fetch(Url.modifyAdmin, {
      headers: { 
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify(params)
    }).then((data) => {
      this.handleList(data)
      Notification('success', '重置密码为123456', '', 1)
    }).catch((err) => {
      Notification('error', err.toString(), '', 1)
    })
    this.setState({
      modifyVisible: false,
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  showModal = (value, text) => {
    console.log(text)
    this.setState({
      [value]: true,
    })
    if(text) {
      this.setState({
        selectValue: text,
        finalValue: text,
      })
    }
  }

  modifyAdmin = () => {
    let params = {
      username: encodeURIComponent(this.state.username),
      password: encodeURIComponent(this.state.passwordValue),
      id: this.state.selectValue._id
    }
    if(this.state.passwordValue === '' && this.state.username === '') {
      Notification('error', '请填写需要修改的信息', '', 1)
    }else {
      Fetch(Url.modifyAdmin, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(params)
      }).then((data) => {
        this.handleList(data)
        this.setState({
          username: '',
          password: '',
          selectValue: [],
          finalValue: []
        })
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
      this.setState({
        modifyVisible: false,
      })
    }
    this.setState({
      confirmLoading: false,
    })
  }

  addAdmin = () => {
    let params = {
      username: encodeURIComponent(this.state.username),
      password: encodeURIComponent(this.state.passwordValue)
    }
    if(this.state.passwordValue === '' || this.state.username === ''){
      Notification('error', '账号密码不能为空', '', 1)
    }else {
      Fetch(Url.adminInfo, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(params)
      }).then((data) => {
        this.handleList(data)
        this.setState({
          username: '',
          passwordValue: ''
        })
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
      this.setState({
        newVisible: false,
      });
    }
    this.setState({
      confirmLoading: false,
    });
  }

  handleOk = (value) => {
    this.setState({
      confirmLoading: true
    })
    if(value === 'modifyVisible') {
      this.modifyAdmin()
    }else if(value === 'newVisible'){
      this.addAdmin()
    }else{
      let params = {
        id:[this.state.selectValue._id]
      }
      Fetch(Url.deleteAdmin, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(params)
      }).then((data) => {
        this.handleList(data)
        this.setState({
          username: '',
          passwordValue: '',
          selectValue: {} ,
          finalValue: {}
        })
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
      this.setState({
        confirmLoading: false,
        [value]: false,
      });
    }
  }

  handleCancel = (value) => {
    this.setState({
      [value]: false,
      selectValue: [],
      finalValue: [],
    });
  }

  handleInput = (value, e) => {
    this.setState({
        [value]: e.target.value.trim()
    })
  }

  render() {
    const { modifyVisible, deleteVisible, confirmLoading, newVisible } = this.state;
    return (
      <div className="Data">
        <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo">
            <p>{this.state.collapsed ? 'AED' : 'AED定位管理平台'}</p>
          </div>
          <Head />
        </Sider>
        <Layout>
          <UserInfo />
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Spin spinning={confirmLoading}>
              <Button icon="plus" type="primary" style = {{marginBottom: 30}}  onClick={this.showModal.bind(this, 'newVisible',false)}>新增用户</Button>
              <Table columns={this.state.columns} dataSource={this.state.data} />
            </Spin>
            <Modal title="编辑"
              visible={modifyVisible}
              onOk={this.handleOk.bind(this, 'modifyVisible')}
              onCancel={this.handleCancel.bind(this, 'modifyVisible')}
              confirmLoading={confirmLoading}
              okText='确定'
              cancelText='取消'
            >
              <div>
                <Input addonBefore="用户名" placeholder="请输入用户名" value={this.state.username} onChange={this.handleInput.bind(this, 'username')} style={{ width: 400 }}/>
                <Input addonBefore="密码" type='password' placeholder="请输入密码" value={this.state.passwordValue} onChange={this.handleInput.bind(this, 'passwordValue')} style={{ width: 400, marginTop: 30 }}/>
              </div>
            </Modal>
            <Modal title="删除"
              visible={deleteVisible}
              onOk={this.handleOk.bind(this, 'deleteVisible')}
              onCancel={this.handleCancel.bind(this, 'deleteVisible')}
              okText='确定'
              cancelText='取消'
            >
              <p>删除当前用户数据</p>
            </Modal>
            <Modal title="新增"
              visible={newVisible}
              onOk={this.handleOk.bind(this, 'newVisible')}
              onCancel={this.handleCancel.bind(this, 'newVisible')}
              confirmLoading={confirmLoading}
              okText='确定'
              cancelText='取消'
            >
              <div>
                <Input addonBefore="用户名" placeholder="请输入用户名" value={this.state.username} onChange={this.handleInput.bind(this, 'username')} style={{ width: 400 }}/>
                <Input addonBefore="密码" type='password' placeholder="请输入密码" value={this.state.passwordValue} onChange={this.handleInput.bind(this, 'passwordValue')} style={{ width: 400, marginTop: 30 }}/>
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
      </div>
    );
  }
}

export default Admin;
