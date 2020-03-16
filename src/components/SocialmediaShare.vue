<template>
  <div class="share col-xs-12">
    <facebook :url="url" sh :scale="scale"></facebook>
    <twitter :url="url" :title="title" :scale="scale"></twitter>
    <telegram :url="url" :title="title" :scale="scale"></telegram>
    <whats-app :url="url" :title="title" :scale="scale"></whats-app>
  </div>
</template>

<script>
import { Facebook, Twitter, Telegram, WhatsApp } from "vue-socialmedia-share";
export default {
  name: "SocialmediaShare",
  components: {
    Facebook,
    Twitter,
    Telegram,
    WhatsApp
  },
  data() {
    return {
      url: "https://charliechen.me/covid-19-nsw/",
      title: "COVID-19 statistics for NSW",
      description:
        "Tracking the latest updates on COVID-19 (Coronavirus) in NSW.",
      scale: "2"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1,
h2
  font-weight: normal

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  color: #42b983

.share > span
  float: left
  padding: 0.5em
</style>
