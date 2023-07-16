import * as PIXI from './pixi.mjs';

let goombauri;
let fireuri;

const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

function createFire(app) {
    const fire = PIXI.Sprite.from(fireuri);
    fire.anchor.set(1, 0.5);
    fire.scale.set(0.1);
    fire.x = 0;
    fire.y = app.screen.height / 2;
    fire.direction = 1 / 2 * Math.PI;
    fire.turningSpeed = 0;
    fire.speed = 2;
    return fire;
}

function createGoomba(app) {
    const goomba = PIXI.Sprite.from(goombauri);
    goomba.anchor.set(0, 0.5);
    goomba.scale.set(0.2);
    goomba.x = app.screen.width;
    goomba.y = app.screen.height / 2;
    goomba.direction = 3 / 2 * Math.PI;
    goomba.turningSpeed = 0;
    goomba.speed = 0.5 + Math.random() * 0.1;
    return goomba;
}



// holder to store the goombas and fires
let goombas = [];
let fires = [];

// クリボーとファイアボールが衝突しているかどうかを判定
function isCollision(goomba, fire) {
    if (goomba.x <= fire.x) {
        return true;
    } else {
        return false;
    }
}

function pixiGame() {
    const totalGoombas = 10;


    for (let i = 0; i < totalGoombas; i++) {
        const dude = createGoomba(app);
        goombas.push(dude);
        app.stage.addChild(dude);
    }

    // create a bounding box for the little dudes
    const dudeBoundsPadding = 100;
    const dudeBounds = new PIXI.Rectangle(
        -dudeBoundsPadding, -dudeBoundsPadding,
        app.screen.width + dudeBoundsPadding * 2, app.screen.height + dudeBoundsPadding * 2);

    // クリボーはファイアボールか左端の壁に当たったときに消える
    // ファイアボールはクリボーか壁に当たったときに消える
    app.ticker.add(() => {
        // update goombas
        goombas.forEach(goomba => {
            goomba.x += Math.sin(goomba.direction) * goomba.speed;
            goomba.y += Math.cos(goomba.direction) * goomba.speed;
        });

        // update fires
        fires.forEach(fire => {
            fire.x += Math.sin(fire.direction) * fire.speed;
            fire.y += Math.cos(fire.direction) * fire.speed;
            if (fire.x > dudeBounds.x + dudeBounds.width) {
                fire.destroy();
            }
        });

        // // 衝突判定と削除の処理
        for (let i = 0; i < fires.length; i++) {
            const fire = fires[i];
            for (let j = 0; j < goombas.length; j++) {
                const goomba = goombas[j];
                if (fire === null || goomba === null) continue;
                if (isCollision(goomba, fire)) {
                    // 配列から削除するために、nullを代入(あとで削除)
                    goombas[j] = null;
                    fires[i] = null;
                    break;
                }
            }
        }
        goombas = goombas.filter(x => x !== null);
        fires = fires.filter(x => x !== null);
    });
}


window.addEventListener('message', event => {
    const message = event.data;
    if (message.type === 'init') {
        const { goombaUri, fireUri } = message.value;
        goombauri = goombaUri;
        fireuri = fireUri;
        pixiGame();
    }
    else if (message.type === 'changeText') {
        const fire = createFire(app);
        fires.push(fire);
        app.stage.addChild(fire);
    }
});
