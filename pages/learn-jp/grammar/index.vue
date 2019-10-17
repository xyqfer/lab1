<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <a href="/learn-jp/grammar/level/5" class="link" target="_blank">
                        N5
                    </a>
                    <a href="/learn-jp/grammar/level/4" class="link" target="_blank">
                        N4
                    </a>
                    <a href="/learn-jp/grammar/level/3" class="link" target="_blank">
                        N3
                    </a>
                    <a href="/learn-jp/grammar/level/2" class="link" target="_blank">
                        N2
                    </a>
                    <a href="/learn-jp/grammar/level/1" class="link" target="_blank">
                        N1
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
            title: 'JP Grammar',
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