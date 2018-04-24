import React, { Component } from 'react';
import './head.css';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import  {Fetch, Notification } from '../util'
import  {Url, jumpUrl } from '../lib'

let selectedKey = '/'
class Head extends Component {
  componentWillMount = () =>{
    selectedKey = window.location.hash.replace('#', '')
    Fetch(Url.loginCheck,{}).then((data) => {
        if(data.data.length === 0){
            window.location.href = jumpUrl.toLogin
        }else {
            this.setState({
                status: JSON.parse(data.data[0]).statue
            })
        }
    }).catch((err) => {
        Notification('error', err.toString(), '', 1)
    })
  }

  state = {
      status: 0,
  }

  jump = (value) => {
    selectedKey = value
  }
  render() {
    return (
        <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" selectedKeys={[selectedKey]}>
            <Menu.Item  key="/" className='data' onClick={this.jump.bind(this, '/')}>
                <Link to="/" onClick={this.jump.bind(this, '/')}>
                    <Icon type="database" onClick={this.jump.bind(this, '/')}/><span>AED数据</span>
                </Link>
            </Menu.Item>
            {this.state.status === 0 && <Menu.Item key="/admin" onClick={this.jump.bind(this, '/admin')}>
                <Link to="/admin"  onClick={this.jump.bind(this, '/admin')}>
                    <Icon type="user"/><span  onClick={this.jump.bind(this, '/admin')}>用户管理</span>
                </Link>
            </Menu.Item>}
        </Menu>
    );
  }
}

export default Head;
