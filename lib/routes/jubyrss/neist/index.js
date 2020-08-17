const got = require('@/utils/got');
const cheerio = require('cheerio');

const host = 'https://nei.st/';

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

    const out = $('.post h2>a')
        .slice(0, 10)
        .map(function() {
            const info = {
                title: $(this)
                    .find('.post h2>a')
                    .text(),
                link: $(this).attr('href'),
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
            const description = $('.entry-content').html();

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
        title: 'Nei.st',
        link: host,
        description: $('meta[name="description"]').attr('content'),
        item: result,
    };
};
