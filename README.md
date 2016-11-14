# Kick Assembler README

This extension allows you to interact with the Commodore 64 cross-assembler Kick Assembler.

It is a port of the [Sublime Text extension by Swoffa](https://github.com/Swoffa/SublimeKickAssemblerC64), and all the credit should go to him and other previous authors and contributors!

## Features

The extension offers syntax highlighting and some commands to build an executable program from the assembler source code.

- "Kick Assembler: Build" will compile the assembler code in the current open file.

## Requirements

You need to have Kick Assembler already installed on your machine.

You probably also want a copy of the Vice C64 emulator if you want to run your programs!

## Extension Settings

You will need to set the path to the Kick Assembler JAR file, for example:

```json
{
    "kickassembler.kickAssPath": "C:\\dev\\C64\\KickAssembler\\KickAss.jar"
}
``` 

## Known Issues

None yet.

## Release Notes

### 1.0.0

Initial release.
