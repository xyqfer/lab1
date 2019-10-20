<template>
    <div>
        <Render0>
            <template #title>
                {{title}}
            </template>
            <template #content>
                <div class="article-item" v-for="item in listData" :key="item.title">
                    <div>{{item.title}}</div>
                    <TextTranslate :text="`${item.title} ${item.content}`" />
                    <div v-html="item.htmlContent"></div>
                    <TextTranslate :text="`${item.title} ${item.content}`" />
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import mixin from '~/mixin/Render0';

const cheerio = require('cheerio');
const iconv = require('iconv-lite');

export default {
    mixins: [mixin],

    async asyncData({ query, $axios, }) {
        const { view } = query;
        const response = await $axios({
            method: 'get',
            url: `https://komachi.yomiuri.co.jp${view}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
            responseType: 'arraybuffer',
        });
        const responseHtml = iconv.decode(response.data, 'Shift_JIS');
        const $ = cheerio.load(responseHtml);

        const title = $('h1').text();
        const listData = $('.main-contents-inner-topi-res-detail-resList-item > li.p-1.pb-0')
            .map((index, elem) => {
                elem = $(elem);
                const title = elem.find('h3').text();
                const $content = elem.find('.article_text > p').eq(0);
                const htmlContent = $content.html();
                const content = $content.text();

                return {
                    title,
                    content,
                    htmlContent,
                };
            })
            .get();
        
        const $mainContent = $('.main-contents-inner-topi-article-text > p').eq(0);
        listData.unshift({
            title: '',
            content: $mainContent.text(),
            htmlContent: $mainContent.html(),
        });

        return {
            title,
            listData,
        };
    }
}
</script>

<style lang="scss" scoped>
.article-item {
    margin-bottom: 30px
}

.hide {
    display: none;
}
</style>