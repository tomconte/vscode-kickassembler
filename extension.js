let vscode = require('vscode');
let cp = require('child_process');

function activate(context) {

    console.log('Congratulations, your extension "kickassembler" is now active!');

    //  define the build and run command
    let commandBuildRun = vscode.commands.registerCommand('kickassembler.build_run', function() {

        if ( buildProgram() == 0 ) {

            runProgram();
        }
    });

    //  define the build command
    let commandBuild = vscode.commands.registerCommand('kickassembler.build', function () {

        buildProgram();

    });

    context.subscriptions.push(commandBuild);
    context.subscriptions.push(commandBuildRun);
}

/**
 *  Build the Program with the Compiler
 */
function buildProgram() {

        let errorCode = 0;

        // Check path settings
        let configuration = vscode.workspace.getConfiguration('kickassembler');
        let kickAssPath = configuration.get('kickAssPath'); 
        let javaPath = configuration.get("javaPath");

        if (kickAssPath == "") {
            vscode.window.showErrorMessage('Kick Assembler JAR path not defined! Set kickassembler.kickAssPath in User Settings.');
            return;
        }

        let editor = vscode.window.activeTextEditor;
        
        let outputChannel = vscode.window.createOutputChannel('Kick Assembler Build');
        outputChannel.clear();
        outputChannel.show();

        let java = cp.spawn(javaPath, [
                "-jar",
                kickAssPath,
                editor.document.fileName
            ]);

        java.on('close', function(e) {
            outputChannel.appendLine('Child process exit code: ' + e);
            errorCode = e;
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

        return errorCode;
}

/**
 *  Run the Vice Emulator with the compiled Program
 */
function runProgram() {

    let configuration = vscode.workspace.getConfiguration('kickassembler');
    let vicePath = configuration.get("vicePath");

    let editor = vscode.window.activeTextEditor;
    let prg = editor.document.fileName;

    //  very crude but will suffice for now
    prg = prg.replace(".asm", ".prg");

    let vice = cp.spawn(vicePath, [prg], {
        detached : true,
        stdio : 'ignore'
    });

    vice.unref();
    
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
