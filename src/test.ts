// import * as vscode from 'vscode';
// import * as PIXI from 'pixi.js';

// export function activate(context: vscode.ExtensionContext) {
//   const panel = vscode.window.createWebviewPanel(
//     'gamePanel', // パネルの識別子
//     'Game', // パネルのタイトル
//     vscode.ViewColumn.Two, // パネルを表示する列
//     {
//       enableScripts: true // Webview 内でスクリプトを実行するかどうか
//     }
//   );

//   const app = createPixiApp(panel);

//   panel.webview.html = getWebviewContent();

//   loadAssets(() => {
//     const enemy = createEnemySprite(app);

//     app.ticker.add((delta) => {
//       enemy.rotation += 0.01 * delta; // 敵の回転アニメーションの例
//     });
//   });
// }

// function getWebviewContent() {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>Game</title>
//       <style>
//         /* ゲーム画面のスタイルを定義 */
//       </style>
//     </head>
//     <body>
//       <div id="gameContainer"></div>
//       <script src="${vscode.Uri.file(require.resolve('pixi.js'))}"></script>
//       <script>
//         const app = new PIXI.Application({
//           width: 400,
//           height: 400,
//           backgroundColor: 0x000000
//         });

//         const gameContainer = document.getElementById('gameContainer');
//         gameContainer.appendChild(app.view);
//         // ゲームのロジックやアニメーションを実装する JavaScript コード
//       </script>
//     </body>
//     </html>
//   `;
// }

// function createPixiApp(panel: vscode.WebviewPanel) {
//   const app = new PIXI.Application({
//     width: 400,
//     height: 400,
//     backgroundColor: 0x000000,
//   });

//   return app;
// }

// function loadAssets(callback: () => void) {
//   const loader = new PIXI.Loader();

//   loader.add('enemy', 'path/to/enemy.png').load(() => {
//     callback();
//   });
// }

// function createEnemySprite(app: PIXI.Application) {
//   const enemyTexture = PIXI.Loader.shared.resources['enemy'].texture; // PixiJS v5以降はこのように変更
//   const enemy = new PIXI.Sprite(enemyTexture);
//   enemy.anchor.set(0.5);
//   enemy.position.set(app.screen.width / 2, app.screen.height / 2);
//   app.stage.addChild(enemy);
//   return enemy;
// }
