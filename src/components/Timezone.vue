<script setup>
import { onMounted, defineProps, ref } from 'vue';

const timezones = ref([]);
const loaded = ref(false);

const setTimezones = t => timezones.value = t;

onMounted(() => {
    fetch('https://worldtimeapi.org/api/timezone')
        .then(r => r.json())
        .then(d => {
            setTimezones(d);
            loaded.value = true;
        });
});

const select = ref(null);

defineProps({
    timezoneChangeCallback: Function
});
</script>

<template>
    <select ref="select" v-if="loaded" name="timezone" id="timezone" @change="timezoneChangeCallback">
        <option value="">Select Timezone</option>
        <option v-for="timezone in timezones" :value="timezone">
            {{ timezone.replaceAll('_', ' ') }}
        </option>
    </select>
</template>

<style>
    select#timezone {
        background-color: #333;
        color: #888;
        border: none;
        font-size: .8rem;
        border-radius: 4px;
        padding: 10px 15px;
        outline: none;
    }
</style>