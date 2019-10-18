<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <a 
                        class="link"
                        v-for="item in 12" :key="item"
                        :href="`/xbr/junior/${item}`" target="_blank"
                    >
                        第{{item}}单元
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
            title: '新标日 - 初级',
        };
    },
}
</script>

<style lang="scss" scoped>
.link {
    display: block;
    margin-bottom: 30px;
}
</style>