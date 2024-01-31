# Running Code Generator and Schematics From Source

## Installation

1. Clone repo `git clone git@github.com:Firestitch/ngx-code-generator.git`
2. `npm install`
3. At this step we have to build our package for future using inside this project
`npm run package`
4. When package build finishes we need to start using `dist` folder as schematic source
   - `cd dist`
   - `npm link`
   - `cd ..`
   - `npm link @firestitch/codegenerator`
   
5. All done!

## Development

In `/apps` folder we have 3 different projects:
- api
- code-generator
- playground


### Api Project

This project constains backend part of code generator. It receives API calls from CodeGenerator in browser
and run schematics with passed parameters.

Its just simple NodeJS server

### Code-generator

This is frontend part of code generator. Contains Angular application

### Playground

Playground is a sandbox project where actual code generator can be tested.

## Where is Schematics code?

Schematics code placed in `/libs/schematics`


## How to run Dev Server?

Dev server is not single application and you have to start 3 different servers

1. `npx nx serve code-generator`
2. `npx nx serve api '--args=--root=apps' --verbose=true` 
3. `npm run watch:schematics`

Manual generation of schematics if you are not watching run on every change
1. `npm run package`


## Build & Publish

Use `npm run package` for build and `npm run package:publish` for publishing your changes



## Debug Schematics

1. node --inspect-brk ./node_modules/.bin/schematics .:dialog  --name=testa   --module=common.module.ts   --path=project/common   --included-module-exports=false   --routable-component=undefined   --route-observer=undefined   --titled-component=false --dry-run=false
2. open in browser chrome://inspect