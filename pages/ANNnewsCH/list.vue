<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="news-item" v-for="(item, index) in listData" :key="item.link">
                    <div>
                        {{item.title}}
                    </div>
                    <div>
                        <video loop controls webkit-playsinline playsinline :src="item.enclosure.url"></video>
                    </div>
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
const Parser = require('rss-parser');
const parser = new Parser();

export default {
    mixins: [mixin],

    data() {
        return {
            title: 'ANNnewsCH',
        };
    },

    async asyncData({ query }) {
        let { offset = 0, count = 10, } = query;
        offset = parseInt(offset);
        count = parseInt(count);

        const feed = await parser.parseURL(`${process.env.RSS_HOST}/youtube/podcast/user/ANNnewsCH`);
        const listData = feed.items.slice(offset, offset + count).map((item) => {
            const $ = cheerio.load(item.content);
            item.rawContent = cheerio.text($('body'));
            item.wordList = [];
            return item;
        });

        return {
            listData,
        };
    },

    methods: {
        async fetchFurigana(index) {
            const content = this.listData[index].content.replace(/<br>/g, '|');
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