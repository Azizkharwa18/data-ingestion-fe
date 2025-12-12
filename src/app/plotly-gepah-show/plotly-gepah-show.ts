import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { PlotlyModule } from 'angular-plotly.js';

@Component({
  selector: 'app-plotly-gepah-show',
  imports: [CommonModule,PlotlyModule],
  standalone: true,
  templateUrl: './plotly-gepah-show.html',
  styleUrl: './plotly-gepah-show.css',
})
export class PlotlyGepahShow implements OnInit {
  http = inject(HttpClient);

  // Plotly Structure
  graphData: any = {
    data: [],
    layout: { title: 'Sales Trends (1h Buckets)', xaxis: { title: 'Time' }, yaxis: { title: 'Avg Sales' } }
  };

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.http.get<any[]>('http://localhost:8000/api/metrics').subscribe(rows => {
      this.processDataForPlotly(rows);
    });
  }

  processDataForPlotly(rows: any[]) {
    // Group by Category to create multiple lines
    const categories = [...new Set(rows.map(r => r.category))];
    const traces = categories.map(cat => {
      const catRows = rows.filter(r => r.category === cat);
      return {
        x: catRows.map(r => r.bucket),
        y: catRows.map(r => r.avg_value),
        type: 'scatter',
        mode: 'lines+markers',
        name: cat
      };
    });

    this.graphData = { ...this.graphData, data: traces };
  }
}
