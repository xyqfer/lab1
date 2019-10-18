<template>
    <div>
        <Render0>
            <template #title>
                <a :href="`https://grammar.izaodao.com/grammar.php?action=view&id=${id}&level=${level}&cha=`" target="_blank">{{title}}</a>
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in grammarInfo" :key="index">
                    ({{index + 1}})
                    <h4>
                        {{item.usage}}
                    </h4>
                    <h4>
                        {{item.mean}}
                    </h4>
                    <div class="example-container">
                        <div class="example-item" v-for="example in item.example" :key="example.jp">
                            <div class="article-item__jp">
                                <span v-html="example.jp"></span>
                            </div>
                            <div v-html="example.zh"></div>
                        </div>
                    </div>
                </div>
                <div ref="footer"></div>
            </template>
        </Render0>
    </div>
</template>

<script>
import parseFurigana from '~/utils/parseFurigana';
import mixin from '~/mixin/Render0';
import BlueBird from 'bluebird';

const cheerio = require('cheerio');
const qs = require('querystring');

export default {
    mixins: [mixin],

    async asyncData({ $axios, route, query, }) {
        const { level, id } = query;
        const response = await $axios({
            method: 'get',
            url: `https://grammar.izaodao.com/grammar.php?action=view&id=${id}&level=${level}&cha=`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });

        const $ = cheerio.load(response.data);
        const title = $('.box1').text();
        let grammarInfo = [];
        let rawList = [];
        $('.box2').each(function() {
            const $elem = $(this);
            const usage = $elem.find('.mark1').text();
            const mean = $elem.find('.mark2-1').text();
            let example = [];

            $elem.find('dl.toggle1 > dd > ul > li').each(function() {
                const originText = $(this).text();

                if (originText.split('/').length === 2) {
                    const [ raw, zh ] = originText.split('/');
                    example.push({
                        raw,
                        zh,
                    });
                    rawList.push(raw);
                } else {
                    originText.split(/\n/).forEach((text) => {
                        const [ raw, zh ] = text.split('/');
                        example.push({
                            raw,
                            zh,
                        });
                        rawList.push(raw);
                    });
                }
            });

            grammarInfo.push({
                usage,
                mean,
                example,
            });
        });

        const translatedData = await $axios({
            url: `${process.env.API_HOST}/api/v1/furigana/translate`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                content: rawList.join('|'),
            }),
        });
        const data = parseFurigana(translatedData.data.data.list);
        let contentList = data.htmlContent.split('<br>');
        grammarInfo.forEach((info) => {
            info.example.forEach((item) => {
                item.jp = contentList.shift();
            });    
        });

        return {
            title,
            id,
            level,
            grammarInfo,
        };
    },

    mounted() {
        this.$refs.footer.style.height = window.innerHeight + 'px';
    },
}
</script>

<style lang="scss" scoped>
.article {
    &-item {
        margin-bottom: 30px;

        &__jp {
            margin-bottom: 10px;
        }
    }
}

.example-container {
    padding-left: 20px;
}

.example-item {
    margin-bottom: 20px;
}
</style>