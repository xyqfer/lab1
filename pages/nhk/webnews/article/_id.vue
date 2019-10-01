<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    {{title}}
                </div>
                <div class="news-content" v-html="htmlContent"></div>
                <WordList :words="wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
export default {
    layout: 'archive0',

    head() {
        return {
            title: this.title,
        };
    },

    async asyncData({ params, $axios }) {
        const { id } = params;
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/webnews/article/${id}`,
        });
        const { title, htmlContent, wordList, } = data.data;

        return {
            title, 
            htmlContent, 
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
</style>
