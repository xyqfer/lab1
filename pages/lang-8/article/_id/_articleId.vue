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

                <div class="article__word-list" v-if="wordList.length > 0">
                    <div class="article__word-wrap" v-for="(word, i) in wordList" :key="i">
                        <div class="article__word-item">
                            {{word.text}}
                        </div>
                        <div :class="{'article__word-item': true, hide: !word.showFurigana}" @click="toggleFurigana(i)">
                            {{word.furigana}}
                        </div>
                    </div>
                    <div class="article__word-reset">
                        <button @click="resetWordList(i)">Reset</button>
                    </div>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';

const cheerio = require('cheerio');
const qs = require('querystring');

export default {
    components: {
        Render0,
    },

    layout: 'archive0',

    head() {
        return {
            title: this.title,
        };
    },

    async asyncData({ params, $axios }) {
        const { userId, articleId, } = params;
        const response = await $axios.get(`http://lang-8.com/${userId}/journals/${articleId}`);

        const $ = cheerio.load(response.data);
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
            })
        });
        const wordList = [];
        let jpCotent = '';
        translatedData.data.data.list.forEach(({ text, furigana }) => {
            if (furigana !== '' && text !== furigana && text !== '|') {
                wordList.push({
                    text,
                    furigana,
                    showFurigana: false,
                });
            }

            let html = '';
            if (text === '|') {
                html = '<br>';
            } else {
                html = `<ruby>${text}<rt>${furigana}</rt></ruby>`;
            }

            jpCotent += html;
        });
        const jpCotentList = jpCotent.split('<br>').filter(isValidItem);
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
        toggleFurigana(i) {
            const state = !this.wordList[i].showFurigana;
            this.wordList[i].showFurigana = state;
        },

        resetWordList(i) {
            this.wordList[i].forEach((item) => {
                item.showFurigana = false;
            });
        },
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