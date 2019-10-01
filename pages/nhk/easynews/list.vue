<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="link-container" v-for="item in listData" :key="item.objectId">
                    <a :href="`/nhk/easynews/article/${item.objectId}`" target="_blank">
                        <h4>
                            {{item.title}}
                        </h4>
                    </a>
                </div>
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

    async asyncData({ params, query, $axios }) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/nhk/easynews`,
        });

        return {
            listData: data.data.list,
        };
    },
}
</script>

<style lang="scss" scoped>
.link-container {
    margin-bottom: 30px;
}
</style>