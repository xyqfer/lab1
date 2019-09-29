<template>
  <div>
    <Render0>
      <template v-slot:title>
        {{title}}
      </template>
      <template v-slot:content>
        <div style="margin-bottom: 30px;" v-for="item in listData" :key="item.objectId">
          <div>
            {{item.title}}
          </div>
          <div>
            {{item.time}}
          </div>
        </div>
      </template>
    </Render0>
  </div>
</template>

<script>
import Render0 from '~/components/Render0.vue';
import axios from 'axios';

export default {
  components: {
    Render0,
  },
  layout: 'archive0',
  data() {
    return {
      title: 'nhk-easynews'
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  async asyncData ({ $axios }) {
    let { data } = await $axios.get('https://ibdkopi6vn.avosapps.us/api/v1/nhk/easynews?limit=5')
    return {
      listData: data
    }
  }
}
</script>
