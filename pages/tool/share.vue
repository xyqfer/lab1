<template>
  <f7-page>
    <f7-navbar title="Share"></f7-navbar>
    <f7-block>
        <f7-list>
            <f7-list-input
                ref="input" 
                type="textarea" 
                :value="url" 
                placeholder="url..."
                @input="url=$event.target.value"
            ></f7-list-input>
        </f7-list>
        <f7-button fill large @click="onShare">Share</f7-button>
        <f7-button large @click="onClear" class="clear-btn">Clear</f7-button>
    </f7-block>
  </f7-page>
</template>
<script>
  export default {
      data() {
          return {
              url: '',
          };
      },

      methods: {
          async onShare() {
            try {
                await navigator.share({
                    url: this.url,
                });
            } catch (err) {

            }
          },

          onClear() {
              this.url = '';
              this.$refs.input.$el.querySelector('textarea').focus();
          },
      }
  }
</script>

<style lang="scss" scoped>
    .clear-btn {
        margin-top: 10px;
    }
</style>
