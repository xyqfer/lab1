<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.link">
                    <a :href="`/wikihow/view?id=${item.link}`" target="_blank">
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

    async asyncData({ $axios, query, }) {
        const { id } = query;
        const response = await $axios({
            method: 'get',
            url: `https://www.wikihow.jp${encodeURI(id)}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const listData = $('#cat_all > .thumbnail')
            .map((index, elem) => {
                elem = $(elem);
                const $link = elem.find('a').eq(0);
                const link = $link.attr('href').replace('https://www.wikihow.jp', '');
                const title = elem.find('.text').text();

                return {
                    title,
                    link,
                };
            })
            .get();

        return {
            title: `wikiHow - ${id.slice(1)}`,
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