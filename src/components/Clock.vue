<script setup>
import { ref, onMounted } from 'vue';

const {
    timezone = 'Europe/Istanbul',
    offsetX = 50,
    offsetY = 50,
    size = 100,
} = defineProps({
    timezone: String,
    offsetX: Number,
    offsetY: Number,
    size: Number,
});

const canvas = ref(null);

onMounted(() => {
    const ctx = canvas.value.getContext('2d');

    const ONE_SECOND = 1000;
    const ONE_MINUTE = ONE_SECOND * 60;
    const ONE_HOUR = ONE_MINUTE * 60;

    const cityName = timezone.split('/').at(-1).replace('_', ' ');

    const getDim = (trigFunc, expr, factor) => trigFunc(
        expr * 2 * Math.PI - (Math.PI / 2)
    ) * size * factor + size;

    const getX = (expr, factor) => getDim(Math.cos, expr, factor);
    const getY = (expr, factor) => getDim(Math.sin, expr, factor);

    const drawHand = (ctx, expr, length) => {
        ctx.beginPath();
        ctx.moveTo(offsetX + size, offsetY + size);
        ctx.lineTo(offsetX + getX(expr, length), offsetY + getY(expr, length));
        ctx.stroke();
    }

    let [h, m, s] = [0, 0, 0];

    const updateTime = () => {
        fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
            .then(r => r.json())
            .then(d => {
                const currentTime = d.datetime;

                [h, m, s] = [
                    parseInt(currentTime.replace(timeRegex, '$1')) % 24,
                    parseInt(currentTime.replace(timeRegex, '$2')),
                    parseInt(currentTime.replace(timeRegex, '$3'))
                ];

                draw();
            });
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineCap = 'round';

        for (let i = 1; i <= 12; i++) {
            ctx.fillText(
                i,
                offsetX + getX(i / 12, 1),
                offsetY + getY(i / 12, 1)
            );
        }

        ctx.lineWidth = 8;
        drawHand(ctx, (h % 12) / 12, 0.4);
        
        ctx.lineWidth = 6;
        drawHand(ctx, m / 60, 0.6);

        ctx.lineWidth = 4;
        drawHand(ctx, s / 60, 0.8);

        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, 8, 0, 2 * Math.PI);
        ctx.fill();
        

        ctx.font = 'bold 18px monospace';
        ctx.textBaseline = 'top';

        const pad = val => parseInt(val).toString().padStart(2, 0);

        const digitalTime = `${pad(h)}:${pad(m)}:${pad(s)}`;

        ctx.fillText(digitalTime, offsetX + size, offsetY - 35);

        ctx.font = 'normal 25px sans-serif';

        ctx.fillText(cityName, offsetX + size, offsetY + size * 2 + 12);

        requestAnimationFrame(draw);
    }

    updateTime();

    const timeRegex = /.*T([0-9]{2}):([0-9]{2}):([0-9]{2})\..*/g;

    setInterval(() => {
        s = (s + 1) % 60;
        
        m = m + 2 * Math.PI / 12 / 5; 
        h = h + 2 * Math.PI / 12 / 5 / 60; 
    }, ONE_SECOND);

    setInterval(() => updateTime(), ONE_MINUTE);
});
</script>

<template>
    <canvas id="canvas" width="300" height="300" ref="canvas"></canvas>
</template>

<style scoped>
#canvas {
    background-color: #fff;
    border-radius: 50%;
}
</style>