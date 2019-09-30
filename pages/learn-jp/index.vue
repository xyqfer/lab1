<template>
    <div>
        <Render0>
            <template #title>
                Learn JP
            </template>
            <template #content>
                <div>
                    <a href="/ANNnewsCH/list" class="link" target="_blank">
                        ANNnewsCH
                    </a>
                    <a href="/lang-8/journals/1378154" class="link" target="_blank">
                        lang-8 oz
                    </a>
                    <a href="/ANNnewsCH/list" class="link" target="_blank">
                        
                    </a>
                    <a href="/ANNnewsCH/list" class="link" target="_blank">
                        
                    </a>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';

export default {
    components: {
        Render0,
    },

    layout: 'archive0',
}
</script>

<style lang="scss" scoped>
.link {
    display: block;
    margin-bottom: 30px;
}
</style>