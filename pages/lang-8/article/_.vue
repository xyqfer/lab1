<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in listData" :key="index">
                    <div class="article-item__jp" v-html="item.jp"></div>
                    <div v-html="item.zh"></div>
                </div>

                <WordList :words="wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';
import WordList from '~/components/WordList.vue';
import parseFurigana from '~/utils/parseFurigana';

const cheerio = require('cheerio');
const qs = require('querystring');

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

    async asyncData({ $axios, route }) {
        const [ userId, articleId, ] = route.params.pathMatch.split('/');
        const response = await $axios.get(`http://lang-8.com/${userId}/journals/${articleId}`);

        const $ = cheerio.load(response.data, {
            decodeEntities: false
        });
        const title = $('#subject_show').text();

        const isValidItem = (item) => {
            return item !== '' && item !== '\n';
        };
        let zhContent = $('#body_show_ori').html().split('<br>').filter(isValidItem);
        zhContent = [title].concat(zhContent);

        const rawJPContent = $('#body_show_mo').html().replace(/<br>/g, '|');
        const translatedData = await $axios({
            url: `${process.env.API_HOST}/api/v1/furigana/translate`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                content: rawJPContent,
            }),
        });
        const { wordList, htmlContent } = parseFurigana(translatedData.data.data.list);
        const jpCotentList = htmlContent.split('<br>').filter(isValidItem);
        const listData = jpCotentList.map((item, index) => {
            return {
                jp: item,
                zh: zhContent[index],
            };
        });

        return {
            title,
            listData,
            wordList,
        };
    },

    methods: {
        
    },
}
</script>

<style lang="scss" scoped>
.article {
    &-item {
        margin-bottom: 30px;

        &__jp {
            margin-bottom: 10px;
        }
    }
}
</style>