const canvas = document.querySelector('canvas#clock');

const ctx = canvas.getContext('2d');

const offsetX = 50;
const offsetY = 50;
const size = 100;

const getX = (expr, factor) => Math.cos(expr * 2 * Math.PI - (Math.PI / 2)) * size * factor + size;
const getY = (expr, factor) => Math.sin(expr * 2 * Math.PI - (Math.PI / 2)) * size * factor + size;

ctx.font = '12px sans-serif';

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i <= 12; i++) {
    ctx.fillText(
      i, 
      offsetX + getX(i / 12, 1), 
      offsetY + getY(i / 12, 1)
    );
  }
  
  const h = (new Date()).getHours() % 12;
  const m = (new Date()).getMinutes();
  const s = (new Date()).getSeconds();

  ctx.beginPath();
  ctx.moveTo(offsetX + size, offsetY + size);
  ctx.lineTo(offsetX + getX(h / 12, 0.5), offsetY + getY(h / 12, 0.5));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(offsetX + size, offsetY + size);
  ctx.lineTo(offsetX + getX(m / 60, 0.7), offsetY + getY(m / 60, 0.7));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(offsetX + size, offsetY + size);
  ctx.lineTo(offsetX + getX(s / 60, 0.9), offsetY + getY(s / 60, 0.9));
  ctx.stroke();
  
  requestAnimationFrame(draw);
}

draw();