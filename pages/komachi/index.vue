<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.title">
                    <a :href="`/komachi/post?view=${item.link}`" target="_blank">
                        <h4>
                            {{item.title}} - {{item.response}} 回复
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
const iconv = require('iconv-lite');

export default {
    mixins: [mixin],

    async asyncData({ $axios, }) {
        const response = await $axios({
            method: 'get',
            url: 'https://komachi.yomiuri.co.jp/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
            responseType: 'arraybuffer',
        });
        const responseHtml = iconv.decode(response.data, 'Shift_JIS');
        const $ = cheerio.load(responseHtml);
        const listData = $('#num_access .p-topi-list')
            .map((index, elem) => {
                elem = $(elem);
                const $link = elem.find('a').eq(0);
                const link = $link.attr('href');
                const title = elem.find('.p-topi-list-summary-head').text();
                const response = elem.find('.res').text().trim();

                return {
                    title,
                    link,
                    response,
                };
            })
            .get();

        return {
            title: '発言小町',
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