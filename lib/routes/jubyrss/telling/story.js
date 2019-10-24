const got = require('@/utils/got');
const cheerio = require('cheerio');
const url = require('url');

const host = 'https://telling.asahi.com/';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${host}story`,
        headers: {
            Referer: `${host}story`,
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);

    const out = $('.c-article-block')
        .slice(0, 10)
        .map(function() {
            const info = {
                title: $(this)
                    .find('.c-article-block__body>a')
                    .text(),
                link: $(this)
                    .find('.c-article-block__body>a')
                    .attr('href'),
                pubDate: $(this)
                    .find('.c-article-block__date')
                    .text(),
            };
            return info;
        })
        .get();

    const result = await Promise.all(
        out.map(async (info) => {
            const title = info.title;
            const itemUrl = url.resolve(host, info.link);
            const date = new Date(info.pubDate).toString();

            const cache = await ctx.cache.get(itemUrl);
            if (cache) {
                return Promise.resolve(JSON.parse(cache));
            }

            const response = await got.get(itemUrl);
            const $ = cheerio.load(response.data);
            $('.c-titleSub, .c-title--h1, .article__date, .article__relation-area').remove();
            const description = $('.article__body').html();

            const single = {
                title: title,
                link: itemUrl,
                description: description,
                pubDate: date,
            };
            ctx.cache.set(itemUrl, JSON.stringify(single), 24 * 60 * 60);
            return Promise.resolve(single);
        })
    );

    ctx.state.data = {
        title: $('meta[property="og:title"]').attr('content'),
        link: `${host}story`,
        description: $('meta[name="description"]').attr('content'),
        item: result,
    };
};
