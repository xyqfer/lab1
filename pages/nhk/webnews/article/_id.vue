<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <TextTranslate :text="rawHtmlContent" />
                <div class="news-content" v-html="htmlContent"></div>
                <WordList :words="wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';
import { request } from 'graphql-request';

const cheerio = require('cheerio');

export default {
    mixins: [mixin],

    async asyncData({ params, }) {
        const { id } = params;
        const endpoint = `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`;
        const query = `
            query($id: String) {
                NHKWebNews(equalTo: {objectId: $id}, limit: 1) {
                    title
                    htmlContent
                    wordList
                }
            }
        `;

        const { NHKWebNews, } = await request(endpoint, query, {
            id,
        });
        const { title, htmlContent, wordList, } = NHKWebNews[0];
        const $ = cheerio.load(htmlContent);
        $('rt').remove();
        const rawHtmlContent = cheerio.text($('body')).trim();

        return {
            title,
            htmlContent,
            rawHtmlContent,
            wordList,
        };
    },
}
</script>

<style lang="scss" scoped>
.news-content {
    margin-top: 20px;

    &__item {
        margin-top: 10px;
    }

    &__input {
        width: 100%;
        box-sizing: border-box;
    }
}

.hide {
    display: none;
}
</style>
