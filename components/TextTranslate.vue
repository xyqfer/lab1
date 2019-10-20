<template>
    <div class="translate-container">
        <form class="jisho-form" action="https://jisho.org/search" method="post" target="_blank">
            <input class="hide" type="text" :value="text" name="keyword">
            <button type="submit">Jisho</button>
        </form>
        <a :href="`https://translate.google.cn/#view=home&op=translate&sl=ja&tl=zh-CN&text=${text}`" target="_blank">Google Translate</a>
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
}
</script>

<style lang="scss" scoped>
.translate-container {
    display: flex;
}

.jisho-form {
    margin-right: 20px;
}

.hide {
    display: none;
}
</style>