<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.articleId">
                    <a :href="`/lang-8/article/${id}/${item.articleId}`" target="_blank">
                        <h4>
                            {{item.title}}
                        </h4>
                    </a>
                    <div>
                        {{item.description}}
                    </div>
                </div>
                <div>
                    <template v-if="page > 1">
                        <div><a :href="`/lang-8/journals/${id}?page=${page - 1}`" target="_blank">上一页</a></div> <br />
                    </template>
                    <div><a :href="`/lang-8/journals/${id}?page=${page + 1}`" target="_blank">下一页</a></div> <br />
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';

const cheerio = require('cheerio');

export default {
    components: {
        Render0,
    },

    layout: 'archive0',

    head() {
        return {
            title: this.title,
        };
    },

    async asyncData({ params, query, $axios, }) {
        const { id } = params;
        let { page = 1 } = query;
        page = parseInt(page);

        const response = await $axios({
            method: 'get',
            url: `http://lang-8.com/${id}/journals?page=${page}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const listData = $('.journals_flex')
            .map((index, elem) => {
                elem = $(elem);
                const $link = elem.find('.journal_title > a');
                const title = $link.text();
                const link = $link.attr('href');
                const paths = link.split('/');
                const articleId = paths[paths.length - 1];
                const description = elem.find('.journal_body').text();

                return {
                    title,
                    articleId,
                    description,
                };
            })
            .get();

        return {
            title: `${id}-journals`,
            listData,
            id,
            page,
        };
    }
}
</script>

<style lang="scss" scoped>
.article-item {
    margin-bottom: 30px
}
</style>