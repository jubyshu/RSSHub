const got = require('@/utils/got');
const cheerio = require('cheerio');

const host = 'https://www.bookbang.jp/';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${host}news`,
        headers: {
            Referer: `${host}news`,
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);

    const out = $('.thumbnail_list li')
        .slice(0, 10)
        .map(function() {
            const info = {
                title: $(this)
                    .find('.title')
                    .text(),
                link: $(this)
                    .find('.title>a')
                    .attr('href'),
                pubDate: $(this)
                    .find('.date')
                    .text(),
            };
            return info;
        })
        .get();

    const result = await Promise.all(
        out.map(async (info) => {
            const title = info.title;
            const itemUrl = info.link;
            const date = new Date(info.pubDate).toString();

            const cache = await ctx.cache.get(itemUrl);
            if (cache) {
                return Promise.resolve(JSON.parse(cache));
            }

            const response = await got.get(itemUrl);
            const $ = cheerio.load(response.data);
            $('.recommend_book_list, .box_editor, .tags_list, .sns_sharebutton_list').remove();
            const description = $('.content_body').html();

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
        link: `${host}news`,
        description: $('meta[name="description"]').attr('content'),
        item: result,
    };
};
