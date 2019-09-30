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
                    <div class="news-item__btn-container">
                        <button @click="fetchFurigana(index)">Furigana</button>
                    </div>
                    <div class="news-item__word-list" v-if="item.wordList.length > 0">
                        <div class="news-item__word-wrap" v-for="(word, i) in item.wordList" :key="i">
                            <div class="news-item__word-item">
                                {{word.text}}
                            </div>
                            <div :class="{'news-item__word-item': true, hide: !word.showFurigana}" @click="toggleFurigana(index, i)">
                                {{word.furigana}}
                            </div>
                        </div>
                        <div class="news-item__word-reset">
                            <button @click="resetWordList(index)">Reset</button>
                        </div>
                    </div>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';
import { asyncData } from '~/mixin/env';

const Parser = require('rss-parser');
const parser = new Parser();
const { API_HOST } = process.env;

export default {
    mixins: [asyncData],

    components: {
        Render0,
    },

    layout: 'archive0',

    data() {
        return {
            title: 'ANNnewsCH',
        };
    },

    head() {
        return {
            title: this.title,
        };
    },

    async asyncData({ query }) {
        let { offset = 0, count = 5, } = query;
        offset = parseInt(offset);
        count = parseInt(count);

        const feed = await parser.parseURL(`${process.env.RSS_HOST}/youtube/podcast/user/ANNnewsCH`);
        const listData = feed.items.slice(offset, offset + count).map((item) => {
            item.wordList = [];

            return item;
        });

        return {
            listData,
        };
    },

    methods: {
        async fetchFurigana(index) {
            const data = {
                content: this.listData[index].content,
            };
            const body = Object.entries(data).map(([key, value]) => {
                return `${key}=${value}`;
            }).join('&');

            const response = await fetch(`${API_HOST}/api/v1/furigana/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body,
            });
            const result = await response.json();

            if (result.success) {
                const wordList = [];
                const content = result.data.list.reduce((acc, { text, furigana }) => {
                    if (furigana !== '' && text !== furigana) {
                        wordList.push({
                            text,
                            furigana,
                            showFurigana: false,
                        });
                    }

                    acc += `<ruby>${text}<rt>${furigana}</rt></ruby>`;
                    return acc;
                }, '');

                this.listData[index].content = content;
                this.listData[index].wordList = wordList;
            }
        },

        toggleFurigana(index, i) {
            const state = !this.listData[index].wordList[i].showFurigana;
            this.listData[index].wordList[i].showFurigana = state;
        },

        resetWordList(index) {
            this.listData[index].wordList.forEach((item) => {
                item.showFurigana = false;
            });
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

    &__word-list {
        margin-top: 20px;
    }

    &__word-wrap {
        display: flex;
        margin-bottom: 10px;
    }

    &__word-item {
        width: 50%;
        text-align: center;

        &.hide {
            opacity: 0;
        }
    }

    &__word-reset {
        margin-top: 30px;
    }
}
</style>