# Running Code Gen and Schematics From Source

Here is a sample directory structure of the 4 projects you will need

/boilerplate (or any Firestitch project codebase)
    /frontend
/npm-code-generator
/npm-schematics


1. Install a Firestitich codebase and run `npm i` in the frontend directory
2. Run `npm i` in /npm-code-generator
3. Run `npm i` in /npm-code-generator/frontend
4. Run `npm i` in /npm-code-schematics
5. cd npm-code-schematics && npm link
6. cd /boilerplate/frontend && npm link @firestitch/schematics
7. cd npm-code-generator && npm link
8. cd /boilerplate/frontend && npm link @firestitch/codegenerator


