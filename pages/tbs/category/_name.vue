<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.link">
                    <a :href="`/tbs/view?id=${item.link}`" target="_blank">
                        <h4>
                            {{item.title}}
                        </h4>
                    </a>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';

const cheerio = require('cheerio');

export default {
    mixins: [mixin],

    async asyncData({ params, query, $axios, }) {
        const { name } = params;
        const response = await $axios({
            method: 'get',
            url: `https://news.tbs.co.jp/${name}/index.html`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        let listData = [];
        $('#mainContent').each(function() {
            const $elem = $(this);
            const $link = $elem.find('a').eq(0);
            const title = $elem.find('h2').text();

            listData.push({
                title,
                link: $link.attr('href'),
            });
        });

        $('article.ls-primary').each(function() {
            const $elem = $(this);
            const $link = $elem.find('a').eq(0);
            const title = $elem.find('.gs-heading').text();

            listData.push({
                title,
                link: $link.attr('href'),
            });
        });

        return {
            title: `TBS ${name} news`,
            listData,
        };
    }
}
</script>

<style lang="scss" scoped>
.article-item {
    margin-bottom: 30px
}
</style>