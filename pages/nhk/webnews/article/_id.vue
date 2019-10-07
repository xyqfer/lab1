<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="news-content" v-html="htmlContent"></div>
                <WordList :words="wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';

export default {
    mixins: [mixin],

    async asyncData({ params, $axios }) {
        const { id } = params;
        const { data } = await $axios({
            method: 'post',
            url: `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`,
            headers: {
                'Content-Type': 'application/graphql',
            },
            data: `
                {
                    NHKWebNews(equalTo: {objectId: "${id}"}, limit: 1) {
                        title,
                        htmlContent,
                        wordList,
                    }
                }
            `,
        });

        return data.data.NHKWebNews[0];
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
