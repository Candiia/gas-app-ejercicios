import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeList } from '../models/code-postal.interface';


@Injectable({
  providedIn: 'root'
})
export class CodePostalService {

  constructor(private http: HttpClient) { }

  getPostalCode(): Observable<CodeList[]> {
    return this.http.get<CodeList[]>('http://localhost:3000/code-list');
  }
}
