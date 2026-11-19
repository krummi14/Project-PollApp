import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Bootstraps the Angular application with the root component {@link App}
 * and the global configuration {@link appConfig}.
 * Errors during bootstrapping are logged to the console.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
