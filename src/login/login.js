import React, { Component } from 'react';
import './login.css';
import { Icon, Input, Button, Checkbox  } from 'antd';
import  {Fetch, Notification } from '../util'
import  {Url, jumpUrl } from '../lib'


class Login extends Component {
  
    componentWillMount = () =>{
      this.setState({
        aedRem: false
      })
      localStorage.setItem('aedRem', 'false')
    }
    state = {
      username: '',
      passwordValue: '',
      aedRem: false,
    };

    handleInput = (value, e) => {
      this.setState({
          [value]: e.target.value.trim()
      })
    }

    onChange = (e) => {
      this.setState({
        aedRem: e.target.checked
      })
      localStorage.setItem('aedRem', e.target.checked.toString())
    }

    onLogin = () => {
      let params = {
        username: encodeURIComponent(this.state.username),
        password: encodeURIComponent(this.state.passwordValue),
        aedRem: this.state.aedRem
      }
      Fetch(Url.login, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(params)
      }).then((data) => {
        localStorage.aedUsername = this.state.username
        window.location.href = jumpUrl.toIndex
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
    }
 
  
    render() {
      
      return (
        <div className = 'login'>
            <div className = 'content'>
                <div>
                  <p style={{ fontSize: 30, fontWeight: 600 }}>
                    AED定位管理平台
                  </p>
                </div>
                <div>
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="账号" value={this.state.username} onChange={this.handleInput.bind(this, 'username')} style={{ width: 400 }}/>
                </div>
                <div>
                  <Input type ='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="密码" value={this.state.passwordValue} onChange={this.handleInput.bind(this, 'passwordValue')} style={{ width: 400, marginTop: 30 }}/>
                </div>
                <div>
                  <Checkbox onChange={this.onChange} style={{ width: 400, marginTop: 30 }}>自动登录</Checkbox>
                </div>
                <div>
                  <Button type="primary" style={{ width: 400, marginTop: 30 }} onClick = {this.onLogin}>登录</Button>
                </div>
            </div>
        </div>
      );
    }
  }
  
  export default Login;