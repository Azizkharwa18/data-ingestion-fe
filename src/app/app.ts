import { Component, inject, signal } from '@angular/core';
import { timer, switchMap, takeWhile, finalize } from 'rxjs';
import { DataService } from './services/data-service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PlotlyModule } from 'angular-plotly.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('distributed-processing-fe');
  private dataService = inject(DataService);

  progress=signal(0);
  isLoading = signal(false);
  statusMessage = signal('');
  finalResult = signal<any>(null);

  triggerPipeline() {
    this.isLoading.set(true);
    this.statusMessage.set('Requesting task...');
    this.finalResult.set(null);

    this.dataService.startProcessing().subscribe({
      next: (resp) => {
        this.statusMessage.set(`Task Started (ID: ${resp.task_id}). Waiting for worker...`);
        this.pollStatus(resp.task_id);
      },
      error: (err) => {
        this.statusMessage.set('Error starting task.');
        this.isLoading.set(false);
      }
    });
  }

pollStatus(taskId: string) {
    // Poll every 200ms (0.2 seconds) to catch the fast completion
    timer(0, 200).pipe(
      switchMap(() => {
        // While waiting, advance progress bar artificially to look "alive"
        // Stops at 90% until we get a true SUCCESS response
        this.progress.update(p => (p < 90 ? p + Math.random() * 15 : p));
        return this.dataService.checkStatus(taskId);
      }),
      takeWhile(res => {
        const isFinished = res.status === 'SUCCESS' || res.status === 'FAILURE';
        // If finished, ensure we complete the observable stream
        return !isFinished;
      }, true), // 'true' includes the final emission (SUCCESS/FAILURE)
      finalize(() => this.isLoading.set(false))
    ).subscribe((res) => {
      if (res.status === 'SUCCESS') {
        this.progress.set(100); // Snap to 100%
        this.statusMessage.set('✅ Ingestion Complete!');
        this.finalResult.set(res.result);
      } else if (res.status === 'FAILURE') {
        this.progress.set(0); // Reset on failure
        this.statusMessage.set(`❌ Pipeline Failed: ${res.result}`);
      } else {
        // While PENDING/STARTED
        this.statusMessage.set(`Processing... (${Math.round(this.progress())}%)`);
      }
    });
  }
}
