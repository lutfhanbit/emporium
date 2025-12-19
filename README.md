# Emporium

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Push commands for amazing

aws ecr get-login-password --region ap-southeast-3 | docker login --username AWS --password-stdin 751244938937.dkr.ecr.ap-southeast-3.amazonaws.com

~/.docker/config.json

docker build -t amazing:1.2.1 .

docker tag amazing:1.2.1 751244938937.dkr.ecr.ap-southeast-3.amazonaws.com/amazing:1.2.1

docker push 751244938937.dkr.ecr.ap-southeast-3.amazonaws.com/amazing:1.2.1
