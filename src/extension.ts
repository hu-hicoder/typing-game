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

  const goombaUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'image', 'Goomba.png'))).toString();
  const fireUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'image', 'fire.png'))).toString();

  panel.webview.postMessage({
    type: 'init',
    value: {
      goombaUri: goombaUri,
      fireUri: fireUri
    }
  });

  vscode.workspace.onDidChangeTextDocument(event => {
    // テキストの変更時の処理
    panel.webview.postMessage({
      type: 'changeText',
      value: undefined
    });
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