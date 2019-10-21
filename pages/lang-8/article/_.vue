<template>
    <div>
        <Render0>
            <template #title>
                <a :href="`http://lang-8.com/${userId}/journals/${articleId}`" target="_blank">{{title}}</a>
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in listData" :key="index">
                    <div class="article-item__jp">
                        <span v-html="item.jp"></span>
                        <a :href="`https://jisho.org/search/${item.raw}`" target="_blank">Jisho</a>
                    </div>
                    <div v-html="item.zh"></div>
                </div>
                <WordList :words="wordList"></WordList>
            </template>
        </Render0>
    </div>
</template>

<script>
import parseFurigana from '~/utils/parseFurigana';
import mixin from '~/mixin/Render0';

const cheerio = require('cheerio');
const qs = require('querystring');

export default {
    mixins: [mixin],

    async asyncData({ $axios, route }) {
        const [ userId, articleId, ] = route.params.pathMatch.split('/');
        const response = await $axios({
            method: 'get',
            url: `http://lang-8.com/${userId}/journals/${articleId}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });

        const $ = cheerio.load(response.data, {
            decodeEntities: false
        });
        const title = $('#subject_show').text();

        const isValidItem = (item) => {
            return item !== '' && item !== '\n';
        };
        let zhContent = $('#body_show_ori').html().split('<br>').filter(isValidItem);
        zhContent = [title].concat(zhContent);

        const rawJPContent = $('#body_show_mo').html().replace(/<br>/g, '|').replace(/\n/g, '').trim();
        const rawJPContentList = $('#body_show_mo').html().split('<br>').filter(isValidItem);
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
                raw: rawJPContentList[index],
            };
        });

        return {
            title,
            listData,
            wordList,
            userId, 
            articleId,
        };
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