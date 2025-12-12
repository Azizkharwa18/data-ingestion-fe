import { Routes } from '@angular/router';
import { PlotlyGepahShow } from './plotly-gepah-show/plotly-gepah-show';
import { importProvidersFrom } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
// import Plotly from 'plotly.js';

export const routes: Routes = [
  {path:'',providers:[importProvidersFrom(PlotlyModule.forRoot(PlotlyJS))],component:PlotlyGepahShow}
];
