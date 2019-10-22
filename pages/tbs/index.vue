<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div>
                    <a href="/tbs/category/society" class="link" target="_blank">
                        社会
                    </a>
                    <a href="/tbs/category/politics" class="link" target="_blank">
                        政治
                    </a>
                    <a href="/tbs/category/economics" class="link" target="_blank">
                        経済
                    </a>
                    <a href="/tbs/category/international" class="link" target="_blank">
                        国際
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
            title: 'TBS News',
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