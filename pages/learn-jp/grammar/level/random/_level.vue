<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <iframe class="iframe" ref="iframe" :src="`/learn-jp/grammar/level/view?id=${id}&level=${level}`" frameborder="0"></iframe>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';
import { request } from 'graphql-request';

export default {
    mixins: [mixin],

    async asyncData({ params, }) {
        const { level } = params;
        const map = {
            '1': 398,
            '2': 403,
            '3': 200,
            '4': 456,
            '5': 282,
        };
        const skip = Math.floor(Math.random() * map[level]);
        const endpoint = `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`;
        const dbName = `JP_Grammar_${level}`;
        const query = `
            query($skip: Int) {
                ${dbName}(limit: 1, skip: $skip) {
                    id
                }
            }
        `;

        const data = await request(endpoint, query, {
            skip,
        });
        return {
            id: data[dbName][0].id,
            title: `JP Grammar N${level} random`,
            level,
        };
    },

    mounted() {
        this.$refs.iframe.style.height = window.innerHeight + 'px';
    },
}
</script>

<style lang="scss" scoped>
.link-container {
    margin-bottom: 30px;
}

.iframe {
    width: 100%;
}
</style>