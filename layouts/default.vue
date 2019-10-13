<template>
  <f7-app :params="{ theme: 'ios', routes, name: 'My F7 App', id: 'com.f7.dev' }">
        <!-- Status bar overlay for full screen mode (Cordova or PhoneGap) -->
        <f7-statusbar></f7-statusbar>
        <!-- Your main view, should have "main" prop -->
        <f7-panel left cover resizable>
          <f7-view url="/panel-left/" links-view=".view-main"></f7-view>
        </f7-panel>
        <f7-panel right reveal resizable>
          <f7-view url="/panel-right/"></f7-view>
        </f7-panel>
        <f7-view main>
          <!-- Initial Page -->
          <nuxt />
        </f7-view>
  </f7-app>
</template>

<script>
  import routes from '~/routes';

  export default {
    data() {
      return {
        routes,
      };
    },
  };
</script>

<style lang="scss">
#__nuxt,
#__layout {
  height: 100%;
}

@import url('~/node_modules/framework7/css/framework7.bundle.min.css');
@import url('~/assets/css/app.css');
</style>