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
import article from '~/apollo/queries/nhk/webnews/article';

export default {
    apollo: {
        articleData: {
            query: article,
            prefetch: ({ route }) => ({ id: route.params.id }),
            variables () {
                return { id: this.$route.params.id }
            },
            update: (data) => {
                return data.articleData[0];
            },
        },
    },

    mixins: [mixin],

    data() {
        return {
            title: '',
        };
    },

    watch: {
        articleData({ title }) {
            this.title = title;
        },
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
