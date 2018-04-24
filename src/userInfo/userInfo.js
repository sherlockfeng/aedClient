import React, { Component } from 'react';
import './userInfo.css';
import { Avatar, Icon, Dropdown, Menu } from 'antd';
import  {Fetch, Notification } from '../util'
import  {Url, jumpUrl } from '../lib'
import userimg from '../img/u41.jpg'

class UserInfo extends Component {
  componentWillMount = () =>{
    this.setState({
        username: localStorage.aedUsername,
    })
  }

  state = {
    username:'',
    status:'1'
  }

  logout = () => {
    Fetch(Url.logout, {}).then((data) => {
        window.location.href = jumpUrl.toLogin
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
  }


  render() {

    const menu = (
      <Menu>
        <Menu.Item key="0" style={{marginTop:'10px'}}>
          <div onClick = {this.logout} >
            <Icon type="logout" style={{paddingRight:'10px'}}/>注销
          </div>
        </Menu.Item>
      </Menu>
    );
    
    return (
        <div className="userinfo">
            <Avatar src={userimg} style={{cursor: 'pointer'}}/>
            <Dropdown overlay={menu} placement="bottomCenter">
              <Icon type="caret-down" style={{color: '#ddd', fontSize:'5px',paddingLeft:'5px',cursor:'pointer'}}/>
            </Dropdown>
            <span style={{marginLeft: 10}}>{this.state.username}</span>
        </div>
    );
  }
}

export default UserInfo;