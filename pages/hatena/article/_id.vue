<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in listData" :key="index">
                    <div class="article-item__jp" v-html="item.jp"></div>
                    <TextTranslate :text="item.raw" />
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

    async asyncData({ $axios, params }) {
        const { id } = params;
        const response = await $axios({
            method: 'get',
            url: `https://anond.hatelabo.jp/${id}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });

        const isValidItem = (item) => {
            return item !== '' && item !== '\n';
        };
        const $ = cheerio.load(response.data, {
            decodeEntities: false
        });
        const title = $('.section h3').eq(0).text();

        const rawJPContentList = $('.section p').slice(0, -2).map(function() {
            return $(this).text().trim();
        }).get().filter(isValidItem);
        const translatedData = await $axios({
            url: `${process.env.API_HOST}/api/v1/furigana/translate`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                content: rawJPContentList.join('|'),
            }),
        });
        const { wordList, htmlContent } = parseFurigana(translatedData.data.data.list);
        const jpCotentList = htmlContent.split('<br>');
        const listData = jpCotentList.map((item, index) => {
            return {
                jp: item,
                raw: rawJPContentList[index],
            };
        });

        return {
            title,
            listData,
            wordList,
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