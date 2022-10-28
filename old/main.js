const clock = (selector, timezone = 'Europe/Istanbul') => {
  const canvas = selector;

  const ctx = canvas.getContext('2d');

  const offsetX = 50;
  const offsetY = 50;
  const size = 100;

  const ONE_SECOND = 1000;
  const ONE_MINUTE = ONE_SECOND * 60;
  const ONE_HOUR = ONE_MINUTE * 60;

  const cityName = timezone.split('/').at(-1);

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

  let [ h, m, s ] = [ 0, 0, 0 ];

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    for (let i = 1; i <= 12; i++) {
      ctx.fillText(
        i, 
        offsetX + getX(i / 12, 1), 
        offsetY + getY(i / 12, 1)
      );
    }
    
    drawHand(ctx, (h % 12) / 12, 0.5);
    drawHand(ctx, m / 60, 0.6);
    drawHand(ctx, s / 60, 0.8);

    ctx.font = 'normal 20px monospace';
    ctx.textBaseline = 'top';

    const pad = val => val.toString().padStart(2, 0);

    const digitalTime = `${pad(h)}:${pad(m)}:${pad(s)}`;
    
    ctx.fillText(digitalTime, offsetX + size, offsetY - 35);

    ctx.font = 'normal 30px monospace';
    
    ctx.fillText(cityName, offsetX + size, offsetY + size * 2 + 20);

    requestAnimationFrame(draw);
  }

  const timeRegex = /.*T([0-9]{2}):([0-9]{2}):([0-9]{2})\..*/g;

  fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
    .then(r => r.json())
    .then(d => {
      const currentTime = d.datetime;

      [ h, m, s ] = [ 
        parseInt(currentTime.replace(timeRegex, '$1')) % 24, 
        parseInt(currentTime.replace(timeRegex, '$2')), 
        parseInt(currentTime.replace(timeRegex, '$3')) 
      ];

      draw();
    });

  setInterval(() => s = (s + 1) % 60, ONE_SECOND);
  setInterval(() => m = (m + 1) % 60, ONE_MINUTE);
  setInterval(() => h = (h + 1) % 24, ONE_HOUR);
}