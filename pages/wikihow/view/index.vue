<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="news-item" v-for="(item, index) in listData" :key="item.rawContent">
                    <div>{{index + 1}}</div>
                    <div class="news-item__content" v-html="item.content"></div>
                    <TextTranslate :text="item.rawContent" />
                    <div class="news-item__btn-container">
                        <button @click="fetchFurigana(index)">Furigana</button>
                    </div>
                    <WordList :words="item.wordList"></WordList>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import parseFurigana from '~/utils/parseFurigana';
import mixin from '~/mixin/Render0';

const cheerio = require('cheerio');

export default {
    mixins: [mixin],

    async asyncData({ query, $axios, }) {
        const { id } = query;

        const response = await $axios({
            method: 'get',
            url: `https://www.wikihow.jp${encodeURI(id)}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const listData = $('.step')
            .map((index, elem) => {
                elem = $(elem);
                const rawContent = elem.text();

                return {
                    wordList: [],
                    rawContent,
                    content: rawContent,
                };
            })
            .get();

        const title = $('h1').text();

        return {
            title,
            listData,
        };
    },

    methods: {
        async fetchFurigana(index) {
            const content = this.listData[index].rawContent;
            const data = {
                content,
            };
            const body = Object.entries(data).map(([key, value]) => {
                return `${key}=${value}`;
            }).join('&');

            const response = await fetch(`${this.$store.state.API_HOST}/api/v1/furigana/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body,
            });
            const result = await response.json();

            if (result.success) {
                const { wordList, htmlContent, } = parseFurigana(result.data.list);
                this.listData[index].content = htmlContent;
                this.listData[index].wordList = wordList;
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.news-item {
    margin-bottom: 30px;

    &__content {
        margin-top: 20px;
    }

    &__btn-container {
        margin-top: 10px;
    }
}

.hide {
    display: none;
}
</style>