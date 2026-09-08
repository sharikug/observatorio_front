import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvestigacionData } from '../models/investigacion.models';

@Injectable({ providedIn: 'root' })
export class InvestigacionService {
  private dataUrl = 'assets/data/investigacion.json';

  constructor(private http: HttpClient) {}

  getDatos(): Observable<InvestigacionData> {
    return this.http.get<InvestigacionData>(this.dataUrl);
  }
}

