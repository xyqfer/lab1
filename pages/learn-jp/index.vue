<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <a href="/nhk/easynews/list" class="link" target="_blank">
                        NHK EasyNews
                    </a>
                    <a href="/nhk/easynews/wordlist" class="link" target="_blank">
                        NHK EasyNews WordList
                    </a>
                    <a href="/nhk/webnews/list" class="link" target="_blank">
                        NHK WebNews
                    </a>
                    <a href="/ANNnewsCH/list" class="link" target="_blank">
                        ANNnewsCH
                    </a>
                    <a href="/lang-8/journals/1378154" class="link" target="_blank">
                        lang-8 oz
                    </a>
                    <a href="/komachi" class="link" target="_blank">
                        発言小町
                    </a>
                    <a href="/learn-jp/grammar" class="link" target="_blank">
                        JP Grammar
                    </a>
                    <a href="/xbr" class="link" target="_blank">
                        新标日
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
            title: 'Learn JP',
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