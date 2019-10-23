<template>
    <div>
        <div class="word-list" v-if="wordList.length > 0">
            <div class="word-wrap" v-for="(word, index) in wordList" :key="index">
                <div :class="{'word-item': true, hide: !word.showFurigana}" @click="toggleFurigana(index, $event)">
                    {{word.furigana}}
                </div>
                <div class="word-item">
                    {{word.text}} <button @click="speakText(word.text)">Speak</button>
                </div>
            </div>
            <div class="word-reset">
                <button @click="resetWordList()">Reset</button>
            </div>
        </div>
    </div>
</template>

<script>
import speak from '~/utils/speak';

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

        toggleFurigana(index, { target }) {
            const state = !this.wordList[index].showFurigana;
            this.wordList[index].showFurigana = state;

            window.scrollBy({
                top: target.clientHeight + 10,
                behavior: 'smooth',
            });
        },

        resetWordList() {
            this.wordList.forEach((item) => {
                item.showFurigana = false;
            });
            this.logCount();
        },

        logCount() {
            fetch(`${this.$store.state.API_HOST}/api/v1/jp/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    count: this.wordList.length,
                }),
            });
        },

        speakText(text) {
            speak(text);
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