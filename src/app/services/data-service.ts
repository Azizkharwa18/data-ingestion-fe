import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TaskResponse {
  task_id: string;
  status: string;
  result?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  startProcessing(): Observable<{ task_id: string }> {
    return this.http.post<{ task_id: string }>(`${this.apiUrl}/start-task`, {
      filename: 'large_sales_data.csv'
    });
  }

  checkStatus(taskId: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/status/${taskId}`);
  }

}
