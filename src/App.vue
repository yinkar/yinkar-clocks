<script setup>
import Clock from './components/Clock.vue';
import Timezone from './components/Timezone.vue';
import { nextTick, ref } from 'vue';

const home = ref(false);
const timezone = ref('');

const timezoneSelect = ref(null);

const singleClock = ref(null);

const timezoneChangeCallback = d => {
    home.value = true;

    timezone.value = d.target.value;
    window.location.hash = d.target.value;

    if (!window.location.hash) return;

    nextTick(() => {
        home.value = false;
    });
};

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
    <div ref="singleClock" clock="single-clock" v-else>
        <Clock :timezone="timezone" />
    </div>

    <Timezone :timezoneChangeCallback="timezoneChangeCallback" ref="timezoneSelect" />
</template>