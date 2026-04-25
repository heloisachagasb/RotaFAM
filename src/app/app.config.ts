import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Routing } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(Routing)]
};
