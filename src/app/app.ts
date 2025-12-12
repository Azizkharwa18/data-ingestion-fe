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
    // Poll every 2 seconds until status is SUCCESS or FAILURE
    timer(0, 2000)
      .pipe(
        switchMap(() => this.dataService.checkStatus(taskId)),
        takeWhile(res => res.status !== 'SUCCESS' && res.status !== 'FAILURE', true),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((res) => {
        this.statusMessage.set(`Current State: ${res.status}`);

        if (res.status === 'SUCCESS') {
          this.finalResult.set(res.result);
        } else if (res.status === 'FAILURE') {
          this.statusMessage.set('Pipeline Failed.');
        }
      });
  }
}
