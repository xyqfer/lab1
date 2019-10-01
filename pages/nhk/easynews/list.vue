<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';

export default {
    components: {
        Render0,
    },

    layout: 'archive0',

    data() {
        return {
            title: 'NHK-EasyNews',
        };
    },

    head() {
        return {
            title: this.title,
        };
    },

    async asyncData({params, query, $axios}) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/easynews`,
        });
        const { htmlContentList, wordList} = data.data;
    },
}
</script>

<style lang="scss" scoped>

</style>