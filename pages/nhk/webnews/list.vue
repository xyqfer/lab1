<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="link-container" v-for="item in listData" :key="item.objectId">
                    <a :href="`/nhk/webnews/article/${item.objectId}`" target="_blank">
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
import mixin from '~/mixin/Render0';

export default {
    mixins: [mixin],

    data() {
        return {
            title: 'NHK-WebNews',
        };
    },

    async asyncData({ params, query, $axios }) {
        const { data } = await $axios({
            method: 'post',
            url: `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`,
            headers: {
                'Content-Type': 'application/graphql',
            },
            data: `
                {
                    NHKWebNews(descending:createdAt, limit: 20) {
                        title,
                        objectId,
                    }
                }
            `,
        });

        return {
            listData: data.data.NHKWebNews,
        };
    },
}
</script>

<style lang="scss" scoped>
.link-container {
    margin-bottom: 30px;
}
</style>