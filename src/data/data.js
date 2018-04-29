import React, { Component } from 'react';
import Head from '../head/head'
import './data.css';
import { Layout, Icon, Table, Divider, Button, Modal, Input, Spin, Radio, AutoComplete, Upload, message } from 'antd';
import  {Fetch, Notification } from '../util'
import  {Url } from '../lib'
import UserInfo from '../userInfo/userInfo'
const { Header, Sider, Content } = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const idToText = { 0: '已启用', 1: '已停用'}
const textToId = { '已启用': 0, '已停用': 1}

const imgType = ['jpg', 'jpeg', 'png']

// let filename = ''

class Data extends Component {

  handleList = (data) => {
    let list = data.data
    let on = []
    let off = []
    list.forEach((item, index) => {
      list[index].key = index
      list[index].location = item.latitude + ',' + item.longitude
      if(item.status === 0){
        on.push(item)
      }
      if(item.status === 1){
        off.push(item)
      }
      list[index].status = <span><span style= {{color: item.status === 0 ? 'green' : 'red'}}>● </span>{idToText[list[index].status]}</span>
    })
    this.setState({
      data: list,
      dataAll: list,
      dataOn: on,
      dataOff: off,
      confirmLoading: false,
      showStatue: 10
    })
  }

  componentWillMount = () =>{
    Fetch(Url.aedInfo, {}).then((data) => {
      this.handleList(data)
    }).catch((err) => {
      Notification('error', err.toString(), '', 1)
      this.setState({
        confirmLoading: false
      })
    })
  }
  state = {
    dataSource:[],
    collapsed: false,
    columns: [{
      title: 'AED详细地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '经纬度',
      dataIndex: 'location',
      key: 'location',
    }, {
      title: '状态',
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
        <div>
          <span onClick={this.showModal.bind(this, 'modifyVisible', text)} style={{color: '#1890ff', cursor:'pointer'}}>编辑</span>
          <Divider type="vertical" />
          <span style={{color: '#1890ff', cursor:'pointer'}} onClick={this.showModal.bind(this, 'deleteVisible', text)}>删除</span>
          <Divider type="vertical" />
          <Upload  style={{color: '#1890ff', cursor:'pointer'}}
             name = 'file'
             action = {Url.upload+'?filename='+this.state.filename}
             onChange = {this.handleUpload.bind(this, text)}
             beforeUpload = {this.beforeUpload.bind(this, text)}
             showUploadList = {false}
          >
            <span>上传</span>
          </Upload>
        </div>
      ),
    }],

    filename: '',
    data : [],
    dataAll: [],
    dataOn: [],
    dataOff: [],
    showStatue: 10,

    modifyVisible: false,
    confirmLoading: false,

    addressValue: '',
    locationValue: '',

    deleteVisible: false,

    newVisible:false,

    selectValue:[{
      key: '',
      address: '',
      latitude: '',
      longitude: '',
      updatetime: '',
      status: '',
      id: ''
    }],

    finalValue: [{
      key: '',
      address: '',
      latitude: '',
      longitude: '',
      updatetime: '',
      status: '',
      id: ''
    }],

    selectedRowValue: [],
    selectedRowKeys: [],

    radioValue: 0,

    searchInfoValue: '',

    latitude:'',
    longitude:''

  };

  handleUpload = (text, info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success('上传图片成功');
      Fetch(Url.aedInfo, {}).then((data) => {
        this.handleList(data)
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
        this.setState({
          confirmLoading: false
        })
      })
    } else if (info.file.status === 'error') {
      message.error('上传图片失败');
    }
  }

  beforeUpload = (text, file) => {
    let isImg = false

    for(let i = 0;i < imgType.length; i++) {
      if(file.type.toLowerCase().indexOf(imgType[i].toLowerCase())!==-1){
        isImg = true
      }
    }
    if(!isImg){
      message.error('只能上传图片文件');
      return false
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2M');
      return false
    }
    this.setState({
      filename: text._id
    })
  }

  getAddress = (value, type) => {
    // eslint-disable-next-line
    let geocoder, map, marker = null;
   // eslint-disable-next-line
    geocoder = new qq.maps.Geocoder();


    let codeAddress = () => {
        let address = value;
        //对指定地址进行解析
        geocoder.getLocation(address);
        //设置服务请求成功的回调函数
        geocoder.setComplete((result)=> {
          let detail = result.detail
          
          this.setState({
            locationValue: '纬度：' + detail.location.lat + ', 经度：' + detail.location.lng 
          })
          let params = {
            latitude: detail.location.lat,
            longitude: detail.location.lng,
            status: this.state.radioValue,
            address: this.state.addressValue
          }
          if(detail.addressComponents.city){
            params.city = detail.addressComponents.city.replace('市','')
          }else{
            params.city = '中国'
          }
          if(type === 'newVisible') {
            Fetch(Url.aedInfo, {
              headers: { 
                "Content-Type": "application/json"
              },
              method: 'POST',
              body: JSON.stringify(params)
            }).then((data) => {
              this.handleList(data)
              this.setState({
                addressValue: '',
                locationValue: '',
                radioValue: 0
              })
            }).catch((err) => {
              Notification('error', err.toString(), '', 1)
            })
            this.setState({
              confirmLoading: false,
            })
          }else if(type === 'modifyVisible') {
            params.id = this.state.selectValue[0]._id
            Fetch(Url.modifyAed, {
              headers: { 
                "Content-Type": "application/json"
              },
              method: 'POST',
              body: JSON.stringify(params)
            }).then((data) => {
              this.handleList(data)
              this.setState({
                addressValue: '',
                locationValue: '',
                radioValue: 0,
                [type]: false,
                selectValue: [],
                finalValue: []
              })
            }).catch((err) => {
              Notification('error', err.toString(), '', 1)
            })
            this.setState({
              confirmLoading: false,
            })
          }
          

        });
        //若服务请求失败，则运行以下函数
        geocoder.setError(() => {
          Notification('info', '出错了，请输入正确的地址！！！', '', 1)
          this.setState({
            confirmLoading: false
          })
        });
    }
    codeAddress();
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  showModal = (value, text) => {
    let tempText = {}
    this.setState({
      [value]: true,
    })
    if(!text) {
      this.setState({
        addressValue: '',
        locationValue: '',
        radioValue: 0
      })
    }else {
      tempText = Object.create(text)
      tempText.status = tempText.status.props.children[1]
      let temp = [tempText]
      this.setState({
        selectValue: temp,
        finalValue: temp,
        radioValue: textToId[tempText.status]
      });
    }
    if(value === 'modifyVisible') {
      this.setState({
        addressValue: text.address,
        // longitude:text.longitude,
        // latitude:text.latitude,
        // locationValue: '纬度：' + text.latitude + ', 经度：' + text.longitude,
        status: textToId[tempText.status],
        latitude: text.latitude,
        longitude: text.longitude
      })

    }
  }

  handleOk = (value) => {
    if( value === 'newVisible') {
      this.setState({
        confirmLoading: true
      })
      this.getAddress(this.state.addressValue, value)
    }else if(value === 'modifyVisible'){
        let params = {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          status: this.state.radioValue,
          address: this.state.addressValue
        }
        params.id = this.state.selectValue[0]._id
        Fetch(Url.modifyAed, {
          headers: { 
            "Content-Type": "application/json"
          },
          method: 'POST',
          body: JSON.stringify(params)
        }).then((data) => {
          this.handleList(data)
          this.setState({
            addressValue: '',
            locationValue: '',
            radioValue: 0,
            modifyVisible: false,
            selectValue: [],
            finalValue: [],
            longitude: '',
            latitude: ''
          })

        }).catch((err) => {
          Notification('error', err.toString(), '', 1)
        })
        this.setState({
          confirmLoading: false,
        })
    }else {
      let params = {
        id:[this.state.selectValue[0]._id]
      }
      Fetch(Url.deleteAed, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(params)
      }).then((data) => {
        this.handleList(data)
        this.setState({
          addressValue: '',
          locationValue: '',
          radioValue: 0,
          [value]: false,
          selectValue: [],
          finalValue: []
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

  handleInput = (e) => {
    this.setState({
      addressValue: e.trim()
    })
    Fetch(Url.tips, {
      headers: { 
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({input: e.trim()})
    }).then((data) => {
      this.setState({
        dataSource: data.data,
      });
    }).catch((err) => {
      Notification('error', err.toString(), '', 1)
    })
  }

  onSelect = (type,value) => {
    this.setState({
      addressValue: value
    })
    this.getAddress(value, type)
  }

  handleInputText = (value, e) => {
    this.setState({
      [value]: e.target.value.trim()
    })
  }

  handleRadio = (e) => {
    this.setState({
      radioValue: e.target.value
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  deleteAll = () => {
    if(this.state.selectedRowValue !== []) {
      this.setState({
        confirmLoading: true,
      });
      let ids = []
      this.state.selectedRowValue.forEach((value, index) => {
        ids.push(value._id)
      })
      Fetch(Url.deleteAed, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({id: ids})
      }).then((data) => {
        this.handleList(data)
      }).catch((err) => {
        Notification('error', err.toString(), '', 1)
      })
      this.setState({
        confirmLoading: false,
        selectedRowKeys: [],
        selectedRowValue: []
      });
    }
  }

  onStatusChange = (e) => {
    this.setState({
      showStatue: e.target.value
    })
    let list = []
    switch (e.target.value) {
      case 10:
        list = this.state.dataAll
        break
      case 0:
        list = this.state.dataOn
        break
      case 1:
        list = this.state.dataOff
        break
      default:
        list = this.state.dataOff
    }
    if(this.state.searchInfoValue !== '') {
      let info = this.state.searchInfoValue
      let temp = []
      temp = list.filter((item) => {
        return item.address.indexOf(info) !== -1
      })
      this.setState({
        data: temp
      })
    }else {
      this.setState({
        data: list
      })
    }
  }

  searchInfo = () => {
    let temp =[]
    let list = []
    switch (this.state.showStatue) {
      case 10:
        list = this.state.dataAll
        break
      case 0:
        list = this.state.dataOn
        break
      case 1:
        list = this.state.dataOff
        break
      default:
        list = this.state.dataAll
    }
    let info = this.state.searchInfoValue
    temp = list.filter((item) => {
      return item.address.indexOf(info) !== -1
    })
    this.setState({
      data: temp,
    })
  }

  handleJWD = (value, e) => {
    this.setState({
      [value]:e.target.value
    })

  }

  showBigImg = (value, name) => {

  }

  deleteImg = (value, name) => {

  }

  render() {
    const { modifyVisible, deleteVisible, confirmLoading, newVisible, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRowValue: selectedRows
        })
      },
    };
    
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
              <div style = {{marginBottom: 20 }}>
                <Button icon="plus" type="primary" style = {{marginRight: 30}}  onClick={this.showModal.bind(this, 'newVisible',false)}>新增AED</Button>
                <Button icon="minus" type="danger" onClick={this.deleteAll}>批量删除</Button>
                <RadioGroup onChange={this.onStatusChange} value={this.state.showStatue} style = {{marginLeft: 30}}>
                  <RadioButton value={10}>全部</RadioButton>
                  <RadioButton value={0}>已启用</RadioButton>
                  <RadioButton value={1}>已停用</RadioButton>
                </RadioGroup>
                <Search placeholder="请输入" onSearch={this.searchInfo} value={this.state.searchInfoValue} onChange={this.handleInputText.bind(this, 'searchInfoValue')} style={{ width: 200, marginLeft: 30 }}/>
              </div>
              <Table rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.data} expandedRowRender={(record) => {
                let list = record.imglist.map((value, index) => {
                  return <div className="imglist">
                    <img alt="img" className="smallimg" src={Url.imgSrc + record._id + '/' + value} onClick={this.showBigImg.bind(this, record, value)}/>
                    <Icon type="close-circle" style={{position:'absolute',top:'-5px',right:'20px'}} onClick={this.deleteImg.bind(this, record, value)}/>
                  </div>
                })
                return list
              }}/>
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
              <AutoComplete addonBefore="地址" placeholder="请输入地址" value={this.state.addressValue} dataSource={this.state.dataSource} onSelect={this.onSelect.bind(this,'modifyVisible')} onSearch={this.handleInput.bind(this)} style={{ width: 400 }}/>
                {/* <Input addonBefore="经纬度" placeholder="自动匹配" value={this.state.locationValue} style={{ width: 400, marginTop: 30 }} disabled={true}/> */}
                <Input addonBefore="经度" placeholder="经度" value={this.state.longitude} style={{ width: 400, marginTop: 30 }} onChange={this.handleJWD.bind(this, 'longitude')}/>
                <Input addonBefore="纬度" placeholder="纬度" value={this.state.latitude} style={{ width: 400, marginTop: 30 }}  onChange={this.handleJWD.bind(this, 'latitude')}/>
                <RadioGroup onChange={this.handleRadio.bind(this)} value={this.state.radioValue} style={{ marginTop: 30, marginLeft: 10}}>
                  <Radio value={0}>启用</Radio>
                  <Radio value={1}>停用</Radio>
                </RadioGroup>
              </div>
            </Modal>

            <Modal title="删除"
              visible={deleteVisible}
              onOk={this.handleOk.bind(this, 'deleteVisible')}
              onCancel={this.handleCancel.bind(this, 'deleteVisible')}
              okText='确定'
              cancelText='取消'
            >
              <p>删除当前AED数据</p>
            </Modal>

            <Modal title="新增"
              visible={newVisible}
              onOk={this.handleOk.bind(this, 'newVisible')}
              onCancel={this.handleCancel.bind(this, 'newVisible')}
              confirmLoading={confirmLoading}
              okText='提交并添加下一个'
              cancelText='取消'
            >
              <div>
                <AutoComplete addonBefore="地址" placeholder="请输入地址" value={this.state.addressValue} dataSource={this.state.dataSource} onSelect={this.onSelect.bind(this,'newVisible')} onSearch={this.handleInput.bind(this)} style={{ width: 400 }}/>
                <Input addonBefore="经纬度" placeholder="自动匹配" value={this.state.locationValue} style={{ width: 400, marginTop: 30 }} disabled={true}/>
                <RadioGroup onChange={this.handleRadio.bind(this)} value={this.state.radioValue} style={{ marginTop: 30, marginLeft: 10}}>
                  <Radio value={0}>启用</Radio>
                  <Radio value={1}>停用</Radio>
                </RadioGroup>
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
      </div>
    );
  }
}

export default Data;
