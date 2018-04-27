const isPro = Object.is(process.env.NODE_ENV, 'production');

module.exports = {
    baseUrl: isPro ? 'https://www.hbxq001.cn/api/' : 'api/'
}