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

const width = ref(300);
const height = ref(300);

const loaded = ref(false);
const failed = ref(false);

const canvas = ref(null);

onMounted(() => {
    const ctx = canvas.value.getContext('2d');

    const ONE_SECOND = 1000;
    const ONE_MINUTE = ONE_SECOND * 60;
    const ONE_HOUR = ONE_MINUTE * 60;

    const cityName = timezone.split('/').at(-1).replace('_', ' ');

    let [h, m, s] = [0, 0, 0];

    const showError = (ctx, msg = '') => {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 100, 100, 0.7)';
        ctx.font = 'normal 30px "Great Vibes", sans-serif';
        ctx.fillText('Error', offsetX + size, offsetY + size + size);
        
        ctx.fillStyle = 'rgba(100, 100, 100, 1)';
        ctx.font = '16px "Syne Mono", monospace';
        ctx.fillText(msg, offsetX + size, offsetY + size + size + 25);
    };

    const updateRemoteTime = () => {
        fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
            .then(r => r.json())
            .then(d => {

                if (d.error) {
                    showError(ctx, 'Bad timezone name');
                    loaded.value = true;
                    failed.value = true;
                    return;
                }

                const currentTime = d.datetime;

                [h, m, s] = [
                    parseInt(currentTime.replace(timeRegex, '$1')) % 24,
                    parseInt(currentTime.replace(timeRegex, '$2')),
                    parseInt(currentTime.replace(timeRegex, '$3'))
                ];

                draw(ctx);

                loaded.value = true;
            })
            .catch(() => {
                if (failed) {
                    return;
                }
                updateRemoteTime();
            });
    };

    const draw = (ctx) => {
        ctx.clearRect(0, 0, width.value, height.value);

        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, .4)'
        ctx.arc(offsetX + size, offsetY + size, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, .6)';
        ctx.fillStyle = (() => {
                const grd = ctx.createLinearGradient(0, 0, 0, size * 2);
                grd.addColorStop(0, '#ddd');
                grd.addColorStop(0.4, '#555');
                grd.addColorStop(0.9, '#444');
                grd.addColorStop(1, '#333');
                return grd;
            })();
        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1d1d1d';
        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, size - 10, 0, Math.PI * 2);
        ctx.fill();


        ctx.fillStyle = '#fff';
        ctx.font = '16px "Syne Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(120, 50, 200, 1)';

        for (let i = 1; i <= 12; i++) {
            ctx.fillText(
                i, 
                offsetX + Math.cos(
                    i / 12 * 2 * Math.PI - (Math.PI / 2)
                ) * size * 0.75 + size,
                offsetY + Math.sin(
                    i / 12 * 2 * Math.PI - (Math.PI / 2)
                ) * size * 0.75 + size + 2
            );
        }
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.font = 'normal 15px "Stick No Bills", sans-serif';
        ctx.fillText('Yinkar', offsetX + size, offsetY + size + size / 2.5);

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.shadowColor = 'transparent';

        ctx.strokeStyle = (() => {
        const grd = ctx.createLinearGradient(0, 0, size, size * 2);
                grd.addColorStop(0, '#111');
                grd.addColorStop(0.4, '#333');
                grd.addColorStop(0.9, '#777');
                grd.addColorStop(1, '#999');
                return grd;
            })();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, size - 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.font = 'normal 18px "Syne Mono", monospace';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ddd';
        
        const pad = val => parseInt(val).toString().padStart(2, 0);
        const digitalTime = `${pad(h)}:${pad(m)}:${pad(s)}`;

        ctx.fillText(digitalTime, offsetX + size, offsetY - 26);
        
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = 'rgba(255, 255, 255, .9)';

        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 200, 0, .6)';

        ctx.translate(offsetX + size, offsetY + size);
        ctx.rotate((Math.PI * 2 / 60) * ((h % 12) * 5 + ((Math.PI * 2 / 60) * (m + s / 60) * 0.8)) - Math.PI / 2);
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.rect(-5, -5, 40, 10);
        ctx.fill();
        ctx.stroke();

        ctx.translate(50, -8);
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(8, 24);
        ctx.lineTo(16, 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(200, 100, 200, 0.6)';

        ctx.resetTransform();
        ctx.translate(offsetX + size, offsetY + size);
        ctx.rotate((Math.PI * 2 / 60) * (m + s / 60) - Math.PI / 2);
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.rect(-4, -4, 45, 8);
        ctx.fill();
        ctx.stroke();

        ctx.translate(55, -6);
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(6, 20);
        ctx.lineTo(12, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(10, 200, 150, 0.6)';

        ctx.resetTransform();
        ctx.translate(offsetX + size, offsetY + size);
        ctx.rotate((Math.PI * 2 / 60) * s - Math.PI / 2);
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.rect(-3, -3, 65, 6);
        ctx.fill();
        ctx.stroke();

        ctx.translate(70, -5);
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(0, 12);
        ctx.lineTo(5, 15);
        ctx.lineTo(10, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.resetTransform();

        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(200, 200, 200, 0.6)';

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#ccc';
        ctx.font = 'normal 25px "Great Vibes", sans-serif';
        ctx.fillText(cityName, offsetX + size, offsetY + size * 2 + 12);

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.save();

        ctx.beginPath();
        ctx.arc(offsetX + size, offsetY + size, size - 20, 0, Math.PI * 2);
        ctx.clip();

        ctx.translate(offsetX, offsetY);
        ctx.fillStyle = (() => {
        const grd = ctx.createLinearGradient(0, 0, size, size * 1.8);
                grd.addColorStop(0, 'rgba(255, 255, 255, .02)');
                grd.addColorStop(0.4, 'rgba(255, 255, 255, .04)');
                grd.addColorStop(0.9, 'rgba(255, 255, 255, .1)');
                grd.addColorStop(1, 'rgba(255, 255, 255, .2)');
                return grd;
            })();
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.2, 200, -Math.PI / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.resetTransform();

        requestAnimationFrame(() => draw(ctx));
    }

    Promise.all([    
        document.fonts.load('25px "Great Vibes"'),
        document.fonts.load('15px "Stick No Bills"'),
        document.fonts.load('18px "Syne Mono"'),
    ]).then(updateRemoteTime);

    const timeRegex = /.*T([0-9]{2}):([0-9]{2}):([0-9]{2})\..*/g;

    setInterval(() => {
        s = (s + 1) % 60;

        if (parseInt(s) === 0) {
            m = (m + 1) % 60;

            if (parseInt(m) === 0) {
                h = (h + 1) % 12;
            }
        }
    }, ONE_SECOND);

    setInterval(() => updateRemoteTime(), ONE_MINUTE);
});
</script>

<template>
    <div class="clock">
        <canvas id="canvas" :width="width" :height="height" ref="canvas"></canvas>
        <div class="preloader" v-if="!loaded"></div>
    </div>
</template>

<style scoped>
.clock {
    position: relative;
    display: inline-block;
    margin-bottom: 50px;
}

#canvas {
    margin: 0;
    padding: 0;
    outline: unset;
    border: none;
}

.preload {
    position: absolute;
}

.preloader::after {
    font-family: 'Syne Mono', monospace;
    position: absolute;
    left: 0;
    top: 150px;
    width: 300px;
    text-align: center;
    animation: loading 550ms linear infinite;
    content: '';
    color: #fff;
}

@keyframes loading {
    0% {
        content: '.LOading.';
    }
    25% {
        content: '..LoAding..';
    }
    50% {
        content: '...LoadIng...';
    }
    75% {
        content: '..LoAding..';
    }
    100% {
        content: '.LOading.';
    }
}
</style>