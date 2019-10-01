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
                <div>
                    <video loop controls webkit-playsinline playsinline :src="audioUrl"></video>
                </div>
                <div class="news-content">
                    <div class="news-content__item" v-for="(item, index) in htmlContentList" :key="index">
                        <p v-html="item"></p>
                        <textarea rows="4" class="news-content__input"></textarea>
                    </div>
                </div>
                <WordList :words="wordList"></WordList>
                <div class="dic-container">
                    <div class="dic-item" v-for="(item, index) in dicList" :key="index">
                        <div v-html="item.htmlTitle"></div>
                        <div class="def-item" v-for="(def, i) in item.defList" :key="def">
                            {{i + 1}}. <span v-html="def"></span>
                        </div>
                    </div>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';
import WordList from '~/components/WordList.vue';

export default {
    components: {
        Render0,
        WordList,
    },

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
            url: `${process.env.API_HOST}/api/v1/nhk/easynews/article/${id}`,
        });
        const { title, audioUrl, htmlContentList, wordList, dicList, } = data.data;

        return {
            title,
            audioUrl,
            htmlContentList,
            wordList,
            dicList,
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

.dic-container {
    margin-top: 30px;
}

.dic-item {
    margin-bottom: 20px;
}

.def-item {
    margin-bottom: 10px;
}
</style>
