const got = require('@/utils/got');
const cheerio = require('cheerio');
const url = require('url');

const host = 'http://www.unitas.me/?cat=16';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: host,
        headers: {
            Referer: host,
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);

    const out = $('.list-post')
        .slice(0, 10)
        .map(function() {
            const info = {
                title: $(this)
                    .find('.grid-title>a')
                    .text(),
                link: $(this)
                    .find('.grid-title>a')
                    .attr('href'),
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
            $('.addtoany_content, .penci-single-link-pages, .post-tags').remove();
            const description = $('.post-entry').html();

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
        link: host,
        description: $('meta[name="description"]').attr('content'),
        item: result,
    };
};
