<template>
    <div class="translate-container">
        <form class="item" action="https://jisho.org/search" method="post" target="_blank">
            <input class="hide" type="text" :value="text" name="keyword">
            <button type="submit">Jisho</button>
        </form>
        <a class="item" :href="`https://translate.google.cn/#view=home&op=translate&sl=ja&tl=zh-CN&text=${text}`" target="_blank">Google Translate</a>
        <button :class="{item: true, hide: !isVoiceReady}" @click="speechSynthesis(text)">Speech Synt</button>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            isVoiceReady: false,
        };
    },

    mounted() {
        setTimeout(() => {
            this.isVoiceReady = true;
        }, 1000);
    },

    methods: {
        speechSynthesis(text) {
            const voice = speechSynthesis.getVoices().find(item => {
                return item.name === 'Kyoko';
            });
            let ssu = new SpeechSynthesisUtterance();
            ssu.text = text;
            ssu.voice = voice;
            speechSynthesis.speak(ssu);
        },
    },
}
</script>

<style lang="scss" scoped>
.translate-container {
    display: flex;
}

.item {
    margin-right: 20px;
}

.hide {
    display: none;
}
</style>