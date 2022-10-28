const canvas = document.querySelector('canvas#clock');

const ctx = canvas.getContext('2d');

const offsetX = 50;
const offsetY = 50;
const size = 100;

const fps = 1;

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

ctx.font = 'bold 20px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.lineWidth = 6;
ctx.lineCap = 'round';

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i <= 12; i++) {
    ctx.fillText(
      i, 
      offsetX + getX(i / 12, 1), 
      offsetY + getY(i / 12, 1)
    );
  }
  
  const date = new Date();

  const [ h, m, s ] = [ 
    date.getHours() % 12, date.getMinutes(), date.getSeconds() 
  ];

  drawHand(ctx, h / 12, 0.4);
  drawHand(ctx, m / 60, 0.6);
  drawHand(ctx, s / 60, 0.8);
  
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1000 / fps);

}

draw();