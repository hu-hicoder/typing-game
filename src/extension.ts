import * as vscode from 'vscode';


const cats = {
  'codingcat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'compilingcat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('typing_game.start', () => {
      // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        'typing', // Identifies the type of the webview. Used internally
        'タイピングゲーム', // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
      );
      
      let iteration = 0;
      const updateWebview = () => {
        const cat = iteration++ % 2 ? 'codingcat' : 'compilingcat';
        panel.title = cat;
        panel.webview.html = getWebviewContent(cat);
      };

      // Set initial content
      updateWebview();

      // And schedule updates to the content every second
      setInterval(updateWebview, 1000);
    })
  );
}

export function deactivate() {}

function getWebviewContent(cat: keyof typeof cats) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${cats[cat]}" width="300" />
</body>
</html>`;
}
