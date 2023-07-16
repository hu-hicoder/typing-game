import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "fs";

function startTypingGame(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'gamePanel',
    'タイピングゲーム',
    vscode.ViewColumn.Two,
    {
      enableScripts: true
    }
  );

  panel.webview.html = getWebviewContent(panel.webview);

  panel.webview.onDidReceiveMessage(message => {
    // メッセージの受信時の処理
  });

  const imageUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'image', 'Goomba.png')));

  panel.webview.postMessage({
    type: 'init',
    value: { imageUri: imageUri.toString() }
  });

  function getWebviewContent(webview: vscode.Webview) {
    const htmlPath = path.resolve(context.extensionPath, 'webview/index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    return htmlContent.replace(/script src="([^"]*)"/g, (match, src) => {
      const realSource = panel.webview.asWebviewUri(vscode.Uri.file(path.resolve(context.extensionPath, 'webview', src)));
      return `script src="${realSource}"`;
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('typing_game.start', () => startTypingGame(context))
  );
}