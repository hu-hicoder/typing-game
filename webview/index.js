import * as PIXI from './pixi.mjs';

let goombauri;
let fireuri;

function createFire(app) {
    const dude = PIXI.Sprite.from(fireuri);
    dude.anchor.set(0.5);
    dude.scale.set(0.1);
    dude.x = 0;
    dude.y = app.screen.height / 2;
    dude.direction = - 3 / 2 * Math.PI;
    dude.turningSpeed = 0;
    dude.speed = - 2;
    return dude;
}

function createGoomba(app) {
    const dude = PIXI.Sprite.from(goombauri);
    dude.anchor.set(0.5);
    dude.scale.set(0.1);
    dude.x = app.screen.width;
    dude.y = app.screen.height / 2;
    dude.direction = 3 / 2 * Math.PI;
    dude.turningSpeed = 0;
    dude.speed = 2;
    return dude;
}


function pixiGame() {
    const app = new PIXI.Application({ resizeTo: window });

    document.body.appendChild(app.view);

    // holder to store the goombas and fires
    const dudes = [];

    const totalGoombas = 10;
    const totalFires = 10;

    for (let i = 0; i < totalGoombas; i++) {
        const dude = createGoomba(app);
        dudes.push(dude);
        app.stage.addChild(dude);
    }
    for (let i = 0; i < totalFires; i++) {
        const dude = createFire(app);
        dudes.push(dude);
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
        for (let i = 0; i < dudes.length; i++) {
            const dude = dudes[i];

            dude.x += Math.sin(dude.direction) * dude.speed;
            dude.y += Math.cos(dude.direction) * dude.speed;

            // wrap the dudes by testing their bounds...
            if (dude.x < dudeBounds.x) {
                dude.speed *= -1;
            }
            else if (dude.x > dudeBounds.x + dudeBounds.width) {
                dude.speed *= -1;
            }

            if (dude.y < dudeBounds.y) {
                dude.speed *= -1;
            }
            else if (dude.y > dudeBounds.y + dudeBounds.height) {
                dude.speed *= -1;
            }
        }
    });
}


// let textChangedCount = 0;
window.addEventListener('message', event => {
    const message = event.data;
    console.log(event);
    if (message.type === 'init') {
        const { goombaUri, fireUri } = message.value;
        goombauri = goombaUri
        fireuri = fireUri
        pixiGame()
    }
    else if (message.type === 'changeText') {
        const textChangedCountDiv = document.getElementById('textChangedCount');
        textChangedCount++;
        textChangedCountDiv.innerHTML = `textChange ${textChangedCount}回`;
    }
});
