import * as PIXI from './pixi.mjs';

let goombauri;

function createGoomba(app) {
    const dude = PIXI.Sprite.from(goombauri);

    // set the anchor point so the texture is centered on the sprite
    dude.anchor.set(0.5);

    // set a random scale for the dude - no point them all being the same size!
    dude.scale.set(0.1);

    // finally lets set the dude to be at a random position..
    dude.x = app.screen.width;
    dude.y = app.screen.height/2;

    // create some extra properties that will control movement :
    // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
    dude.direction =  3/2 * Math.PI;

    // this number will be used to modify the direction of the dude over time
    dude.turningSpeed = 0;

    // create a random speed for the dude between 2 - 4
    dude.speed = 2 + Math.random() * 2;

    return dude;
}


function pixiGame() {
    const app = new PIXI.Application({ resizeTo: window });

    document.body.appendChild(app.view);

    // holder to store the aliens
    const aliens = [];

    const totalDudes = 1000;

    for (let i = 0; i < totalDudes; i++) {
        const dude = createGoomba(app);
        
        // finally we push the dude into the aliens array so it it can be easily accessed later
        aliens.push(dude);

        app.stage.addChild(dude);
    }

    // create a bounding box for the little dudes
    const dudeBoundsPadding = 100;
    const dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,
        -dudeBoundsPadding,
        app.screen.width + dudeBoundsPadding * 2,
        app.screen.height + dudeBoundsPadding * 2);

    app.ticker.add(() => {
        // iterate through the dudes and update their position
        for (let i = 0; i < aliens.length; i++) {
            const dude = aliens[i];

            dude.direction += dude.turningSpeed * 0.01;
            dude.x += Math.sin(dude.direction) * dude.speed;
            dude.y += Math.cos(dude.direction) * dude.speed;
            dude.rotation = -dude.direction - Math.PI / 2;

            // wrap the dudes by testing their bounds...
            if (dude.x < dudeBounds.x) {
                dude.x += dudeBounds.width;
            }
            else if (dude.x > dudeBounds.x + dudeBounds.width) {
                dude.x -= dudeBounds.width;
            }

            if (dude.y < dudeBounds.y) {
                dude.y += dudeBounds.height;
            }
            else if (dude.y > dudeBounds.y + dudeBounds.height) {
                dude.y -= dudeBounds.height;
            }
        }
    });
}


// let textChangedCount = 0;
window.addEventListener('message', event => {
    const message = event.data;
    console.log(event);
    if (message.type === 'init') {
        const { imageUri } = message.value;
        console.log(imageUri)
        goombauri = imageUri;
        pixiGame()

        // const canvas = document.getElementById('gameCanvas');
        // const ctx = canvas.getContext('2d');
        // const { imageUri } = message.value;
        // const image = new Image();
        // image.src = imageUri;
        // let x = canvas.width;

        // image.onload = () => {
        //     const imageSize = 150;
        //     const canvasSize = 500;

        //     function update() {
        //         ctx.clearRect(0, 0, canvas.width, canvas.height);
        //         ctx.drawImage(image, x, 0, imageSize, imageSize);
        //         x -= 1;
        //         if (x + imageSize < 0) {
        //             x = canvas.width;
        //         }
        //         requestAnimationFrame(update);
        //     }

        //     update();
        // };
    }
    else if (message.type === 'changeText') {
        const textChangedCountDiv = document.getElementById('textChangedCount');
        textChangedCount++;
        textChangedCountDiv.innerHTML = `textChange ${textChangedCount}回`;
    }
});
