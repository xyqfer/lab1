<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div v-for="item in  errorInfoList" :key="item.name">
                    <template v-if="item.errorInfo.length > 0">
                        <h3>{{item.name}}</h3>
                        <div class="info-block" v-for="errorInfo in item.errorInfo" :key="errorInfo.oid">
                            <div class="info-time">
                                {{errorInfo.displayTime}}
                            </div>
                            <div class="info-content">
                                {{errorInfo.content}}
                            </div>
                        </div>
                    </template>
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
            title: 'Server Error Status',
        };
    },

    async asyncData({ params, query, $axios }) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/server-status/error?since=${query.since}`,
        });
        const { errorInfoList, } = data.data;

        return {
            errorInfoList,
        };
    },
}
</script>

<style lang="scss" scoped>
.info-block {
    display: flex;
    margin-left: 10px;
    margin-bottom: 20px;
}

.info-time {
    flex-shrink: 0;
    margin-right: 10px;
}

.info-content {
    word-break: break-all;
}
</style>