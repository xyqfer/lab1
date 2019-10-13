<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="date">
                    {{date}} 共 {{totalCount}} +<span :class="{red: totalCountChange > 0}">{{totalCountChange}}</span>
                </div>
                <div class="list-container" v-for="item in listData" :key="item.name">
                    <div class="list-item list-item1">
                        {{item.name}}
                    </div>
                    <div class="list-item list-item2">
                        {{item.count}} +<span :class="{red: item.change > 0}">{{item.change}}</span>
                    </div>
                    <div class="list-item list-item3">
                        {{(item.percent * 100).toFixed(4)}}%
                    </div>
                </div>
                <div class="list-container">
                    <div class="list-item list-item1">

                    </div>
                    <div class="list-item list-item2">
                        {{totalCount}} +<span :class="{red: totalCountChange > 0}">{{totalCountChange}}</span>
                    </div>
                    <div class="list-item list-item3">
                        
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
        const listData = list.reverse().map((item) => {
            item.change = 0;
            return item;
        });

        return {
            date,
            listData,
            totalCount,
            totalCountChange: 0,
        };
    },

    mounted() {
        let previousData = localStorage.getItem(this.date);
        if (previousData) {
            const { listData, totalCount, } = JSON.parse(previousData);
            this.totalCountChange = this.totalCount - totalCount;
            this.listData.forEach((item) => {
                const previousItem = listData.find(({name}) => {
                    return name === item.name;
                });
                item.change = item.count - previousItem.count;
            });
        }

        localStorage.setItem(this.date, JSON.stringify({
            listData: this.listData,
            totalCount: this.totalCount,
        }));
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
    &.list-item1 {
        flex: 2;
        text-align: left;
    }

    &.list-item2 {
        flex: 1;
        text-align: right;
    }

    &.list-item3 {
        flex: 1.4;
        text-align: right;
    }
}

.total-count {
    margin-top: 20px;
}

.red {
    color: red;
}
</style>