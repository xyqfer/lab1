<template>
    <div>
        <div class="word-list" v-if="wordList.length > 0">
            <div class="word-wrap" v-for="(word, index) in wordList" :key="index">
                <div class="word-item">
                    {{word.text}}
                </div>
                <div :class="{'word-item': true, hide: !word.showFurigana}" @click="toggleFurigana(index)">
                    {{word.furigana}}
                </div>
            </div>
            <div class="word-reset">
                <button @click="resetWordList()">Reset</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        words: {
            type: Array,
            default: [],
        },
    },

    data() {
        return {
            wordList: this.flushWordList(),
        };
    },

    watch: {
        words() {
            this.wordList = this.flushWordList();
        },
    },

    methods: {
        flushWordList() {
            return this.words.map((item) => {
                return {
                    showFurigana: false,
                    ...item,
                };
            });
        },

        toggleFurigana(index) {
            const state = !this.wordList[index].showFurigana;
            this.wordList[index].showFurigana = state;
        },

        resetWordList() {
            this.wordList.forEach((item) => {
                item.showFurigana = false;
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.word-list {
    margin-top: 20px;
}

.word-wrap {
    display: flex;
    margin-bottom: 10px;
}

.word-item {
    width: 50%;
    text-align: center;

    &.hide {
        opacity: 0;
    }
}

.word-reset {
    margin-top: 30px;
}
</style>