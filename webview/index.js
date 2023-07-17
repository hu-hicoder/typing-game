import * as PIXI from './pixi.mjs';

let goombauri;
let fireuri;

const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

function createFire(app) {
    const fire = PIXI.Sprite.from(fireuri);
    fire.anchor.set(1, 1);
    fire.scale.set(0.1);
    fire.x = 0;
    fire.y = app.screen.height * 0.8;
    fire.vx = 10;
    fire.vy = 0;
    fire.gravity = 0.5;
    fire.e = 0.6;
    return fire;
}

function createGoomba(app) {
    const goomba = PIXI.Sprite.from(goombauri);
    goomba.anchor.set(0, 1);
    goomba.scale.set(0.1);
    goomba.x = app.screen.width;
    goomba.y = app.screen.height;
    goomba.direction = 3 / 2 * Math.PI;
    goomba.speed = 0.5 + Math.random() * 0.1;
    return goomba;
}



// holder to store the goombas and fires
let goombas = [];
let fires = [];

let tickCount = 0;
let typeCount = 0;

const firePerType = 10;

const typeCountText = new PIXI.Text(0, { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center' });
typeCountText.anchor.set(0.5);
typeCountText.x = 100;
typeCountText.y = 100;
app.stage.addChild(typeCountText);

// クリボーとファイアボールが衝突しているかどうかを判定
function isCollision(goomba, fire) {
    if (goomba.x <= fire.x) {
        return true;
    } else {
        return false;
    }
}

function pixiGame() {
    createGoomba(app);
    // const totalGoombas = 10;


    // for (let i = 0; i < totalGoombas; i++) {
    //     const dude = createGoomba(app);
    //     goombas.push(dude);
    //     app.stage.addChild(dude);
    // }

    // create a bounding box for the little dudes
    const dudeBoundsPadding = 100;
    const dudeBounds = new PIXI.Rectangle(
        -dudeBoundsPadding, -dudeBoundsPadding,
        app.screen.width + dudeBoundsPadding * 2, app.screen.height + dudeBoundsPadding * 2);

    // const text = new PIXI.Text(0, { fontFamily: 'Arial', fontSize: 24, fill: 0x101010, align: 'center' });


    // クリボーはファイアボールか左端の壁に当たったときに消える
    // ファイアボールはクリボーか壁に当たったときに消える
    app.ticker.add(() => {
        if (tickCount % 200 === 0) {
            const goomba = createGoomba(app);
            goombas.push(goomba);
            app.stage.addChild(goomba);
        }
        // update goombas
        goombas.forEach(goomba => {
            goomba.x += Math.sin(goomba.direction) * goomba.speed;
            goomba.y += Math.cos(goomba.direction) * goomba.speed;
        });

        // update fires
        fires.forEach((fire, i) => {
            fire.x += fire.vx;
            fire.y += fire.vy;
            fire.vy += fire.gravity
            if (fire.y > app.screen.height) {
                fire.y = app.screen.height;
                fire.vy *= -fire.e;
            }
            // 画面外に出たものを削除
            if (fire.x > dudeBounds.x + dudeBounds.width) {
                fire.destroy();
                fires[i] = null
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
                    goomba.destroy()
                    fire.destroy()
                    goombas[j] = null;
                    fires[i] = null;
                    break;
                }
            }
        }
        goombas = goombas.filter(x => x !== null);
        fires = fires.filter(x => x !== null);

        tickCount++;
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
        if (typeCount % firePerType == 0) {
            const fire = createFire(app);
            fires.push(fire);
            app.stage.addChild(fire);
        }
        typeCount++;
        typeCountText.text = typeCount;
    }
});
