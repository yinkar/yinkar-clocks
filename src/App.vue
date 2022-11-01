<script setup>
import Clock from './components/Clock.vue';
import { ref } from 'vue';

const home = ref(false);
const timezone = ref('');

if (!window.location.hash) {
  home.value = true;
}
else {
  timezone.value = window.location.hash.substring(1);
}
</script>

<template>
  <div class="clocks" v-if="home">
    <Clock timezone="Europe/Istanbul" />
    <Clock timezone="Asia/Tokyo" />
    <Clock timezone="Europe/London" />
    <Clock timezone="America/New_York" />
  </div>
  <div clock="single-clock" v-else>
    <Clock :timezone="timezone" />
  </div>
</template>