import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// // 1. Import Plotly and the wrapper module
// import { PlotlyModule } from 'angular-plotly.js';
// // 2. Register the Plotly instance manually
// // Check if 'default' exists (common in Angular 17+ / Esbuild builds)
// (PlotlyModule as any).plotlyjs = (PlotlyJS as any).default || PlotlyJS;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
