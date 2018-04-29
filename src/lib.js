const host = 'http://localhost:3000/'
// const host = 'http://118.24.6.178/'
// const host = 'http://47.98.116.23/'
// const host = 'https://heyunf.com/'
// const host = 'https://www.hzhtyl.com/'
const Url = {
    aedInfo: host + 'aedinfo',
    deleteAed: host + 'deleteAed',
    modifyAed: host + 'modifyAed',

    adminInfo: host + 'admininfo',
    deleteAdmin: host + 'deleteAdmin',
    modifyAdmin: host + 'modifyAdmin',

    login: host + 'login',
    loginCheck: host + 'check',
    logout: host + 'logout',
    tips: host + 'tips',

    upload: host + 'upload',

    imgSrc: 'http://localhost:3001/images/'
}

const jumpUrl = {
    toLogin: host + '#/login',
    toIndex: host + '#/'
}

export { Url, jumpUrl }