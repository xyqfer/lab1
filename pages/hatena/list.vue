<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.articleId">
                    <a :href="`/hatena/article${item.articleId}`" target="_blank">
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

    async asyncData({ $axios, }) {
        const response = await $axios({
            method: 'get',
            url: 'https://anond.hatelabo.jp/archive',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const listData = $('.archives ol > li')
            .map((index, elem) => {
                elem = $(elem);
                const $link = elem.find('a').eq(0);
                const title = $link.text();
                const articleId = $link.attr('href');

                return {
                    title,
                    articleId,
                };
            })
            .get();

        return {
            title: 'はてな匿名ダイアリー - 人気記事アーカイブ',
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