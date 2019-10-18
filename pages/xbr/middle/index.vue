<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <a href="/xbr/level/junior" class="link" target="_blank">
                        初级
                    </a>
                    <a href="/xbr/level/middle" class="link" target="_blank">
                        中级
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
            title: '新标日',
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