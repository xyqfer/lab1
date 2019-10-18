<template>
    <div>
        <Render0>
            <template #title>
                <a :href="`https://japan.icerdesign.com/class/Unit${id}-text.html`" target="_blank">{{title}}</a>
            </template>
            <template #content>
                <div class="article-item" v-for="(item, index) in listData" :key="index">
                    <div class="article-item__jp">
                        <span v-html="item.jp"></span>
                    </div>
                    <div v-html="item.zh"></div>
                </div>
            </template>
        </Render0>
    </div>
</template>

<script>
import parseFurigana from '~/utils/parseFurigana';
import mixin from '~/mixin/Render0';

const cheerio = require('cheerio');
const japanruby = (i) => {
    function e(i, e, t) {
        var a = void 0 == t ? "*" : "{" + t + "}",
            s = new RegExp("(.[ゅょゃュョャ]?){" + e + "}((.[ゅょゃュョャ]?)" + a + ")"),
            n = s.exec(i)[2];
        return n
    }
    try {
        if (i.indexOf("!") >= 0) return i = i.replace(/!(.*?)\((.*?)\)/g, "<rt></rt>$1<rt>$2</rt>"), "<ruby>" + i +
            "</ruby>";
        if (i.indexOf("@") >= 0) {
            var t = /([\u3040-\u309f\u30a0-\u30ff]*)@((?:\d{1,2})?)/g;
            return i.replace(t, function (i, t, a) {
                return void 0 == a || "" == a ? t : 0 == a ? e(t, 0, 1) + "<span class='accent0'>" + e(t, 1) +
                    "</span>" : 1 == a ? "<span class='accent'>" + e(t, 0, 1) + "</span>" + e(t, a) : e(t, 0, 1) +
                    "<span class='accent'>" + e(t, 1, a - 1) + "</span>" + e(t, a)
            })
        }
    } catch (a) {
        console.error('error parsing "' + i + '"', a)
    }
    return i
};

export default {
    mixins: [mixin],

    async asyncData({ $axios, route, params, }) {
        const { id } = params;
        const response = await $axios({
            method: 'get',
            url: `https://japan.icerdesign.com/class/Unit${id}-text.html`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            },
        });

        const $ = cheerio.load(response.data, {
            decodeEntities: false,
        });
        let listData = [];
        $('.lesson').slice(0, 4).each(function() {
            const $ul = $(this).find('ul');
            const length = $ul.length;
            const jpRange = length / 2;

            for (let i = 0; i < jpRange; i++) {
                const $li1 = $ul.eq(i).find('li');
                const $li2 = $ul.eq(i + jpRange).find('li');

                $li1.each(function(index) {
                    const $item1 = $(this);

                    listData.push({
                        jp: japanruby($item1.text()),
                        zh: $li2.eq(index).text(),
                    });
                });
            }
        });

        return {
            title: `第${id}单元`,
            id,
            listData,
        };
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
</style>