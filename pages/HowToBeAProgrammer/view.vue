<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in listData" :key="index">
                    <div class="article-item__jp" v-html="item.jp"></div>
                    <div 
                        :class="{hide: item.hide}" 
                        v-html="item.zh"
                        @click="item.hide = false;"
                    ></div>
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
        const fetchContent = async (lang) => {
            let path = id;
            if (lang === 'zh') {
                path = path.replace('jp', 'zh');
            }

            const response = await $axios({
                method: 'get',
                url: `https://github.com${path}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
                },
            });

            const $ = cheerio.load(response.data, {
                normalizeWhitespace: true,
            });

            return $('#readme > article').text().split('\n').filter(item => item !== '');
        };
        const [ jpContentList, zhContentList, ] = await Promise.all([
            fetchContent('jp'),
            fetchContent('zh'),
        ]);

        console.log(jpContentList.length, zhContentList.length)

        const translatedData = await $axios({
            url: `${process.env.API_HOST}/api/v1/furigana/translate`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                content: jpContentList.join('|'),
            }),
        });
        const { wordList, htmlContent } = parseFurigana(translatedData.data.data.list);
        const jpCotentList = htmlContent.split('<br>');
        const listData = jpCotentList.map((item, index) => {
            return {
                jp: item,
                zh: zhContentList[index],
                hide: true,
            };
        });

        return {
            title: '',
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

.hide {
    opacity: 0;
}
</style>