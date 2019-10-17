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

            $elem.find('dl.toggle1 ul p').each(function() {
                const text = $(this).text();
                const splitList = text.split('/');

                if (splitList.length === 2) {
                    const raw = splitList[0];
                    const zh = splitList[1];

                    example.push({
                        raw,
                        zh,
                    });
                    rawList.push(raw);
                } else {
                    const raw1 = splitList[0];
                    let [ zh1, ...raw2 ] = splitList[1].split(/\b/);
                    example.push({
                        raw: raw1,
                        zh: zh1,
                    });
                    rawList.push(raw1);

                    raw2 = raw2.join('');
                    example.push({
                        raw: raw2,
                        zh: splitList[2],
                    });
                    rawList.push(raw2);
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