<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="date">
                    {{date}}
                </div>
                <div class="list-container" v-for="item in listData" :key="item.name">
                    <div class="list-item">
                        {{item.name}}
                    </div>
                    <div class="list-item">
                        {{item.count}}
                    </div>
                    <div class="list-item">
                        {{(item.percent * 100).toFixed(4)}}%
                    </div>
                </div>
                <div class="total-count">
                    共 {{totalCount}}
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
            title: 'Server Storage Status',
        };
    },

    async asyncData({ params, query, $axios }) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/server-status/storage`,
        });
        const { date, list, totalCount, } = data.data;

        return {
            date,
            listData: data.data.list,
            totalCount,
        };
    },
}
</script>

<style lang="scss" scoped>
.date {
    margin-bottom: 20px;
}

.list-container {
    display: flex;
}

.list-item {
    flex: 1;
    text-align: center;
}

.total-count {
    margin-top: 20px;
}
</style>