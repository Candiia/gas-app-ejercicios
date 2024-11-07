import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComunidadesAutonomas } from '../models/comunidades-autonomas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GasAppService {

  constructor(private http: HttpClient) { }

  getGasList() {
    return this.http.get('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres');
  }

  getComunidadesList(): Observable<ComunidadesAutonomas[]> {
    return this.http.get<ComunidadesAutonomas[]>('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/');
  }

  getGasListPorUnComun(iDCCAA: string) {
    return this.http.get(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/${iDCCAA}`);
  }
}
