<template>
    <div>
        <Render0>
            <template #title>
                {{articleData.title}}
            </template>
            <template #content>
                <div class="news-content" v-html="articleData.htmlContent"></div>
                <WordList :words="articleData.wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';
import { request } from 'graphql-request';

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
        return NHKWebNews[0];
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
</style>
