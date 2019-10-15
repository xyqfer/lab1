<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <WordList v-for="item in  wordLists" :key="item.id" :words="item.list"></WordList>
                <div class="more" @click="getMore">获取更多</div>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';

export default {
    mixins: [mixin],

    data() {
        return {
            title: '刷词模式',
        };
    },

    async asyncData({ $axios }) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/easynews/wordlist`,
        });
        const { wordList } = data.data;

        return {
            wordLists: wordList,
        };
    },

    methods: {
        getMore() {
            this.fetchWordList();
        },

        async fetchWordList() {
            const res = await fetch(`${this.$store.state.API_HOST}/api/v1/nhk/easynews/wordlist`);
            const { data } = await res.json();
            this.wordLists = this.wordLists.concat(data.wordList);
        },
    },
}
</script>

<style lang="scss" scoped>
.more {
    margin: 20px 0;
    text-align: center;
    border: 1px solid #000;
    height: 44px;
    line-height: 44px;
}
</style>
