<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="link-container" v-for="(item, index) in listData" :key="index">
                    {{index + 1}}. <a :href="`/learn-jp/grammar/level/view?id=${item.id}&level=${level}`" target="_blank">
                        {{item.grammar}}
                    </a>
                    <div
                        :class="{hide: item.hide}" 
                        @click="item.hide = false;"
                    >
                        {{item.mean}}
                    </div>
                </div>
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
        const endpoint = `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`;
        const dbName = `JP_Grammar_${level}`;
        const query = `
            query {
                ${dbName}(limit: 1000) {
                    id
                    grammar
                    mean
                }
            }
        `;

        const data = await request(endpoint, query);
        const listData = data[dbName].map((item) => {
            item.hide = true;
            return item;
        });
        return {
            listData,
            title: `JP Grammar N${level}`,
            level,
        };
    },
}
</script>

<style lang="scss" scoped>
.link-container {
    margin-bottom: 30px;
}

.hide {
    opacity: 0;
}
</style>