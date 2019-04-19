let vscode = require('vscode');
let cp = require('child_process');

function activate(context) {
    console.log('Congratulations, your extension "kickassembler" is now active!');

    // Define the build and run command
    let commandBuildRun = vscode.commands.registerCommand('kickassembler.build_run', function() {
        if (buildProgram() == 0) {
            runProgram();
        }
    });

    // Define the build and debug command
    let commandBuildDebug = vscode.commands.registerCommand('kickassembler.build_debug', function() {
        if (buildProgram() == 0) {
            runDebugProgram();
        }
    });
    
    // Define the build command
    let commandBuild = vscode.commands.registerCommand('kickassembler.build', function () {
        buildProgram();
    });

    context.subscriptions.push(commandBuild);
    context.subscriptions.push(commandBuildRun);
    context.subscriptions.push(commandBuildDebug);
}

function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;

/**
 *  Build the program with the compiler
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
 *  Run the VICE emulator with the compiled program
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

/**
 *  Run C64 debugger with the compiled program
 */

function runDebugProgram() {
    let configuration = vscode.workspace.getConfiguration('kickassembler');
    let debuggerPath = configuration.get("debuggerPath");

    let editor = vscode.window.activeTextEditor;
    let prg = editor.document.fileName;

    //  very crude but will suffice for now
    prg = prg.replace(".asm", ".prg");

    let db = cp.spawn(debuggerPath, [prg], {
        detached : true,
        stdio : 'ignore'
    });

    db.unref();
}
