# Proyecto-DAW-Battle-Fantasy

## Objetivo
Desarrollar un juego de navegador de batallas por turnos, donde los usuarios deberán registrarse, elegir la clase/trabajo al que quieren pertenecer, que se diferenciarán entre ellas por las habilidades exclusivas que tienen cada una de ellas, y podrán seleccionar misiones donde combatirán contra la máquina y recibir ayuda de otros usuarios. Al ser un juego de navegador, los datos de la partida quedarán guardados para poder seguir jugando en otro momento y desde casi cualquier otro dispositivo.

## Temática
Juego sencillo inspirado en los Final Fantasy clásicos, centrado exclusivamente en las batallas para poder pasar el tiempo muerto de una manera entretenida.

## Tecnologías utilizadas
**Front-end:** Se utilizará Angular con SASS y quizás se utilice Tailwind o Bootstrap.

**Back-end:** Se utilizará Node.js con Socket.io y para la persistencia de datos se utilizará MySQL con posibilidad de decantarse por MongoDB.
# BattleFantasy

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Run locally on other devices

To run a local server and connect to other devices like mobile phones, run:

```bash
ng serve --host 0.0.0.0
```

Make sure to disable firewall and navigate to the ip.

## Run the backend server

To start the backend server navigate to the backend folder and run:

```bash
ng server/server.js
```

## Run the backend locally to work with other devices

Is nedeed to change localhost:3000 to ip:3000

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
