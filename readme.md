Codeworks-Starter
=================

[![Build Status](https://travis-ci.org/jakeoverall/codeworks-starter.svg?branch=master)](https://travis-ci.org/jakeoverall/codeworks-starter) [![Coverage Status](https://coveralls.io/repos/github/jakeoverall/codeworks-starter/badge.svg?branch=master)](https://coveralls.io/github/jakeoverall/codeworks-starter?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/ec13e6cb1c312a4c8a1d/maintainability)](https://codeclimate.com/github/jakeoverall/codeworks-starter/maintainability)

-------------------------------

> package.json start script
```json
  "scripts":{
    "start": "node --nolazy -r ts-node/register src/index.ts"
  }
```

> tsconfig.json
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "es2015",
    "module": "commonjs",
    "esModuleInterop": true,
    "noImplicitAny": false,
    "moduleResolution": "node",
    "inlineSourceMap": true,
    "inlineSources": true,
    "outDir": "dist",
    "baseUrl": ".",
    "declaration": true,
    "declarationDir": "dist/@types",
    "paths": {
      "*": [
        "node_modules/*",
        "dist/@types/*"
      ]
    },
    "types": [
      "node",
      "express"
    ]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "**/*.js"
  ]
}
```

> .vscode tasks.json `ctrl+shift+b` -> tsc: watch - tsconfig.json

> .vscode launch.json
```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/src/index.ts",
  "outFiles": [
    "${workspaceFolder}/dist/*"
  ],
  "restart": true,
  "runtimeExecutable": "nodemon",
  "runtimeArgs": [
    "--nolazy",
    "-r",
    "ts-node/register"
  ],
  "sourceMaps": true,
  "cwd": "${workspaceRoot}",
  "protocol": "inspector",
}
```