<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div v-for="(item, index) in listData" :key="index" class="word-item">
                    <div>{{index + 1}}</div>
                    <div v-html="item.word"></div>
                    <div
                        :class="{hide: item.hide}" 
                        @click="item.hide = false;"
                    >
                        <div v-html="item.furigana"></div>
                        <div v-html="item.explain"></div>
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

    async asyncData({ query, }) {
        const { skip = 0 } = query;
        const endpoint = `${process.env.API_HOST}/graphql${process.env.GRAPHQL_TOKEN}`;
        const gqlQuery = `
            query($skip:Int){
                Anki_N2(limit: 1000, skip: $skip) {
                    word
                    explain
                    furigana
                }
            }
        `;

        const { Anki_N2, } = await request(endpoint, gqlQuery, {
            skip,
        });
        const listData = Anki_N2.map(item => {
            item.hide = true;
            return item;
        });

        return {
            title: 'Anki N2',
            listData,
        };
    },
}
</script>

<style lang="scss" scoped>
.word-item {
    margin-bottom: 20px;
}

.hide {
    opacity: 0;
}
</style>
