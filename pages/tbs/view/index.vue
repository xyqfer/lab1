<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <video loop controls webkit-playsinline playsinline :src="videoUrl"></video>
                </div>
                <div class="article-item">
                    <div class="article-item__jp" v-html="htmlContent"></div>
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

    async asyncData({ $axios, query }) {
        const { id } = query;
        const response = await $axios({
            method: 'get',
            url: `https://news.tbs.co.jp${id}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });

        const $ = cheerio.load(response.data, {
            decodeEntities: false
        });
        const title = $('title').text();

        const rawJPContent = $('#mainContent p').map(function() {
            return $(this).text().trim();
        }).get().join('');
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

        const tbsVideoUrl = 'https://streams.tbs.co.jp/flvfiles/_definst_' + response.data.match(/window\.movieNews='(.+?)';/)[1] + '/playlist.m3u8';
        const videoUrl = `${process.env.MEDIA_PROXY}${encodeURIComponent(tbsVideoUrl)}`;

        return {
            title,
            htmlContent,
            videoUrl,
            wordList,
        };
    },
}
</script>

<style lang="scss" scoped>
.article {
    &-item {
        margin-top: 30px;
        margin-bottom: 30px;

        &__jp {
            margin-bottom: 10px;
        }
    }
}
</style>