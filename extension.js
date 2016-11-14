let vscode = require('vscode');
let cp = require('child_process');

function activate(context) {

    console.log('Congratulations, your extension "kickassembler" is now active!');

    let disposable = vscode.commands.registerCommand('kickassembler.build', function () {

        // Check path settings
        let configuration = vscode.workspace.getConfiguration('kickassembler');
        let kickAssPath = configuration.get('kickAssPath'); 
        if (kickAssPath == "") {
            vscode.window.showErrorMessage('Kick Assembler JAR path not defined! Set kickassembler.kickAssPath in User Settings.');
            return;
        }

        let editor = vscode.window.activeTextEditor;
        
        let outputChannel = vscode.window.createOutputChannel('Kick Assembler Build');
        outputChannel.clear();
        outputChannel.show();

        let java = cp.spawn("java", [
                "-jar",
                kickAssPath,
                editor.document.fileName
            ]);

        java.on('close', function(e) {
            outputChannel.appendLine('Child process exit code: ' + e);
            if (e != 0) {
                vscode.window.showErrorMessage('Compilation failed with errors.');
            }
        });

        java.stdout.on('data', function(data) {
            outputChannel.append('' + data);
        });

        java.stderr.on('data', function(data) {
            outputChannel.append('' + data);
        });
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
