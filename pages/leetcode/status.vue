<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="finish-text">
                    完成度：{{finishedProblemsCount}} / {{total}}
                </div>
                <div>
                    <svg ref="svg" :height="svgHeight" class="finish-graph">
                        <g :transform="`translate(${svgX}, 0)`">
                            <g v-for="row in rows" :key="row" :transform="getTranslate(row)">
                                <rect 
                                    v-for="block in blocksPerRow" :key="block" 
                                    width="12" height="12" 
                                    :x="getX(block)" y="0" 
                                    :fill="getLevelColor(row, block)"
                                ></rect>
                            </g>
                        </g>
                    </svg>
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
            title: 'Leetcode status',
            rows: 0,
            blocksPerRow: 0,
            svgHeight: 0,
            svgX: 0,
        };
    },

    async asyncData({ params, query, $axios }) {
        const { data } = await $axios({
            method: 'get',
            url: `${process.env.API_HOST}/api/v1/leetcode/status`,
        });
        const { total, finishedProblems, } = data.data;
        const finishedProblemsMap = finishedProblems.reduce((acc, item) => {
            acc[item.index] = item;
            return acc;
        }, {});

        return {
            total: 1229,
            finishedProblemsMap,
            finishedProblemsCount: 66,
        };
    },

    mounted() {
        const width = this.$refs.svg.clientWidth;
        const blocksPerRow = Math.floor((width + 3) / 15);
        const rows = Math.ceil(this.total / blocksPerRow);
        const height = 16 * rows - 4;
        const svgX = (width - (blocksPerRow * 15 - 3)) / 2;

        this.rows = rows;
        this.blocksPerRow = blocksPerRow;
        this.svgHeight = height;
        this.svgX = svgX;
    },

    methods: {
        getLevelColor(row, block) {
            const colors = [
                '#ebedf0',
                '#c6e48b',
                '#7bc96f',
                '#196127',
            ];
            const index = ((row - 1) * this.blocksPerRow) + (block - 1);
            const finishedProblem = this.finishedProblemsMap[index];
            const level = finishedProblem ? finishedProblem.level : 0;
            return colors[level];
        },

        getTranslate(row) {
            return `translate(0, ${16 * (row - 1)})`;
        },

        getX(block) {
            return 15 * (block - 1);
        },
    }
}
</script>

<style lang="scss" scoped>
.finish-text {
    margin-bottom: 20px;
}

.finish-graph {
    width: 100%;
}
</style>