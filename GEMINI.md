# Gemini Project Context: dhrm-sporada

## Project Overview

This project is an Angular application, as indicated by the presence of `angular.json`, `package.json` with Angular dependencies, and the `.angular` directory. The application is named "rane-dhrm-sporada" and appears to be a human resources management tool, based on the name "dhrm".

The project is built with Angular CLI version 14.0.2. It uses a variety of libraries, including Angular Material, Bootstrap, and various `ngx` components, suggesting a rich user interface. The inclusion of `xlsx` and `chart.js` suggests that the application has features for data export and visualization.

## Building and Running

### Development Server

To run the development server, use the following command:

```bash
npm start
```

This will start a local development server at `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building the Project

To build the project for production, use the following command:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

This will execute the unit tests via Karma.

## Development Conventions

### Code Scaffolding

The project uses the Angular CLI for code generation. To generate new components, services, or other Angular artifacts, use the `ng generate` command. For example:

```bash
ng generate component component-name
```

### Dependencies

The project's dependencies are managed in the `package.json` file. To add a new dependency, use the `npm install` command:

```bash
npm install <package-name>
```

### Linting

The project has a linting script defined in `package.json`:

```bash
npm run lint
```

This command can be used to check the code for style and quality issues.
