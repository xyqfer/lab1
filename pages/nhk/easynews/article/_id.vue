<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="rtl-link">
                    <a :href="`/nhk/easynews/article-rtl/${id}`" target="_blank">横版阅读</a>
                </div>
                <div>
                    <video ref="video" loop controls webkit-playsinline playsinline :src="audioUrl"></video>
                    <div>
                        <button @click="changePlayRate(1.0)">1.0</button>
                        <button @click="changePlayRate(1.5)">1.5</button>
                        <button @click="changePlayRate(2.0)">2.0</button>
                    </div>
                </div>
                <div class="news-content">
                    <div class="news-content__item" v-for="(item, index) in htmlContentList" :key="index">
                        <p v-html="item"></p>
                        <TextTranslate :text="rawContentList[index]" />                    
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
import mixin from '~/mixin/Render0';

export default {
    mixins: [mixin],

    async asyncData({ params, $axios }) {
        const { id } = params;
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/easynews/article/${id}`,
        });
        const { title, audioUrl, htmlContentList, rawContentList, wordList, dicList, } = data.data;

        return {
            id,
            title,
            audioUrl,
            htmlContentList,
            rawContentList,
            wordList,
            dicList,
        };
    },

    methods: {
        changePlayRate(rate) {
            this.$refs.video.playbackRate = rate;
        },
    },
}
</script>

<style lang="scss" scoped>
.rtl-link {
    margin-bottom: 20px;
}

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
    overflow-x: scroll; 
}
</style>
