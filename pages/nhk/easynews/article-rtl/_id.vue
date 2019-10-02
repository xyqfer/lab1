<template>
    <div>
        <Render0 class="content">
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="news-content">
                    <div class="news-content__item" v-for="(item, index) in htmlContentList" :key="index">
                        <p v-html="item"></p>
                    </div>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';

export default {
    mixins: [mixin],

    async asyncData({ params, $axios }) {
        const { id } = params;
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/easynews/article/${id}`,
        });
        const { title, htmlContentList, } = data.data;

        return {
            title,
            htmlContentList,
        };
    },

    mounted() {
        this.$nextTick(() => {
            document.documentElement.scrollTo(window.innerWidth, 0);
        });
    },
}
</script>

<style lang="scss" scoped>
.content {
    box-sizing: border-box;
    padding: 15px 0;
    writing-mode: vertical-rl;
}

.news-content {
    margin-top: 20px;
}
</style>
