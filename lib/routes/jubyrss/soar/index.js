const got = require('@/utils/got');
const cheerio = require('cheerio');

const host = 'https://soar-world.com/';

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

    const out = $('.left-area a')
        .slice(0, 10)
        .map(function() {
            const info = {
                title: $(this)
                    .find('.post-meta>h2')
                    .text(),
                link: $(this).attr('href'),
                pubDate: $(this)
                    .find('.post-date')
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
            $('#bread, .social, #related-entries, form, #js-donateBoxFixed').remove();
            const description = $('.post-article').html();

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
        title: 'soar（ソア）',
        link: host,
        description: $('meta[name="description"]').attr('content'),
        item: result,
    };
};
