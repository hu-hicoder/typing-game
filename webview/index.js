window.addEventListener('message', event => {
    const message = event.data;
    console.log(event);
    if (message.type === 'init') {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const { imageUri } = message.value;
        const image = new Image();
        image.src = imageUri;
        let x = canvas.width;

        image.onload = () => {
            const imageSize = 150;
            const canvasSize = 500;

            function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, x, 0, imageSize, imageSize);
            x -= 1;
            if (x + imageSize < 0) {
                x = canvas.width;
            }
            requestAnimationFrame(update);
            }

            update();
        };
    }
});

