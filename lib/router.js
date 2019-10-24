const Router = require('koa-router');
const router = new Router();
const config = require('./config');
const logger = require('./utils/logger');

// index
router.get('/', require('./routes/index'));

// test
router.get('/test/:id', require('./routes/test'));

// RSSHub
router.get('/rsshub/rss', require('./routes/rsshub/rss'));

// 微博
router.get('/weibo/user/:uid', require('./routes/weibo/user'));
router.get('/weibo/keyword/:keyword', require('./routes/weibo/keyword'));
router.get('/weibo/search/hot', require('./routes/weibo/search/hot'));
router.get('/weibo/super_index/:id', require('./routes/weibo/super_index'));

// 豆瓣
router.get('/douban/movie/playing', require('./routes/douban/playing'));
router.get('/douban/movie/playing/:score', require('./routes/douban/playing'));
router.get('/douban/movie/playing/:score/:city', require('./routes/douban/playing'));
router.get('/douban/movie/later', require('./routes/douban/later'));
router.get('/douban/movie/ustop', require('./routes/douban/ustop'));
router.get('/douban/group/:groupid', require('./routes/douban/group'));
router.get('/douban/explore', require('./routes/douban/explore'));
router.get('/douban/music/latest/:area?', require('./routes/douban/latest_music'));
router.get('/douban/book/latest', require('./routes/douban/latest_book'));
router.get('/douban/event/hot/:locationId', require('./routes/douban/event/hot'));
router.get('/douban/commercialpress/latest', require('./routes/douban/commercialpress/latest'));
router.get('/douban/bookstore', require('./routes/douban/bookstore'));
router.get('/douban/book/rank/:type', require('./routes/douban/book/rank'));
router.get('/douban/doulist/:id', require('./routes/douban/doulist'));
router.get('/douban/explore/column/:id', require('./routes/douban/explore_column'));
router.get('/douban/people/:userid/status', require('./routes/douban/people/status.js'));
router.get('/douban/topic/:id/:sort?', require('./routes/douban/topic.js'));

// Twitter
if (config.twitter && config.twitter.consumer_key && config.twitter.consumer_secret && config.twitter.access_token && config.twitter.access_token_secret) {
    router.get('/twitter/user/:id', require('./routes/twitter/user'));
    router.get('/twitter/list/:id/:name', require('./routes/twitter/list'));
    router.get('/twitter/likes/:id', require('./routes/twitter/likes'));
} else {
    logger.warn('Twitter RSS is disabled due to the lack of token, api key or relevant config in config.js.');
}

// Instagram
router.get('/instagram/user/:id', require('./routes/instagram/user'));
router.get('/instagram/tag/:tag', require('./routes/instagram/tag'));

// Youtube
if (config.youtube && config.youtube.key) {
    router.get('/youtube/user/:username/:embed?', require('./routes/youtube/user'));
    router.get('/youtube/channel/:id/:embed?', require('./routes/youtube/channel'));
    router.get('/youtube/playlist/:id/:embed?', require('./routes/youtube/playlist'));
} else {
    logger.warn('Youtube RSS is disabled due to the lack of token, api key or relevant config in config.js.');
}

// GitHub
if (config.github && config.github.access_token) {
    router.get('/github/repos/:user', require('./routes/github/repos'));
} else {
    logger.warn('GitHub Repos RSS is disabled due to the lack of token, api key or relevant config in config.js.');
}
router.get('/github/trending/:since/:language?', require('./routes/github/trending'));
router.get('/github/issue/:user/:repo', require('./routes/github/issue'));
router.get('/github/pull/:user/:repo', require('./routes/github/pulls'));
router.get('/github/user/followers/:user', require('./routes/github/follower'));
router.get('/github/stars/:user/:repo', require('./routes/github/star'));
router.get('/github/search/:query/:sort?/:order?', require('./routes/github/search'));
router.get('/github/branches/:user/:repo', require('./routes/github/branches'));
router.get('/github/file/:user/:repo/:branch/:filepath+', require('./routes/github/file'));

// 腾讯大家
router.get('/dajia', require('./routes/tencent/dajia/index'));
router.get('/dajia/author/:uid', require('./routes/tencent/dajia/author'));
router.get('/dajia/zhuanlan/:uid', require('./routes/tencent/dajia/zhuanlan'));

// wechat
router.get('/wechat/wasi/:id', require('./routes/tencent/wechat/wasi'));
router.get('/wechat/wemp/:id', require('./routes/tencent/wechat/wemp'));
router.get('/wechat/csm/:id', require('./routes/tencent/wechat/csm'));
router.get('/wechat/announce', require('./routes/tencent/wechat/announce'));
router.get('/wechat/miniprogram/plugins', require('./routes/tencent/wechat/miniprogram/plugins'));
router.get('/wechat/tgchannel/:id', require('./routes/tencent/wechat/tgchannel'));

// Matters
router.get('/matters/topics', require('./routes/matters/topics'));
router.get('/matters/latest', require('./routes/matters/latest'));
router.get('/matters/hot', require('./routes/matters/hot'));
router.get('/matters/tags/:tid', require('./routes/matters/tags'));
router.get('/matters/author/:uid', require('./routes/matters/author'));

// 古诗文网
router.get('/gushiwen/recommend', require('./routes/gushiwen/recommend'));

// VOCUS 方格子
router.get('/vocus/publication/:id', require('./routes/vocus/publication'));
router.get('/vocus/user/:id', require('./routes/vocus/user'));

// BookBang
router.get('/bookbang/news', require('./routes/jubyrss/bookbang/news'));
router.get('/bookbang/serial/:id', require('./routes/jubyrss/bookbang/serial'));

// Aeon
router.get('/aeon/:id', require('./routes/jubyrss/aeon/index'));

// telling
router.get('/telling/story', require('./routes/jubyrss/telling/story'));

// Soar
router.get('/soar/home', require('./routes/jubyrss/soar/index'));

// 联合文学
router.get('/unitas/recommend', require('./routes/jubyrss/unitas/recommend'));

module.exports = router;
