<template>
  <div class="container">
    <div>
      {{title}}
    </div>
    <div>
      <button @click="onClick">test title</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'index',
    };
  },

  methods: {
    onClick() {
      console.log(this.title);
    },
  }
}
</script>
