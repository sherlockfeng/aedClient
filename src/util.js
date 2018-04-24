import { notification  } from 'antd';

const Fetch = (url, param) => {
    param.credentials = 'include'
    return new Promise((resolve, reject) => {
        fetch(url, param).then((response) => {
            return response.json()
        }).then((data)=>{
            if(data.status === '0') {
                resolve(data)
            }else {
                reject(data.msg)
            }
        }).catch((err)=>{
            reject(err)
        })
    })
}

const Notification = (type = 'info', msg = '', dec = '', time = 4.5) => {
    notification[type]({
      message: msg,
      description: dec,
      duration: time,
    });
};

export { Fetch, Notification }