import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComunidadesAutonomas } from '../models/comunidades-autonomas.interfaces';
import { Provincias } from '../models/provincias.interfaces';

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

  getListPorUnComun(iDCCAA: string) {
    return this.http.get(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/${iDCCAA}`);
  }

  getProvinciasList(iDCCAA: string): Observable<Provincias[]>{
    return this.http.get<Provincias[]>(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/${iDCCAA}`);
  }

  getPorUnaProvincia(idPovincia: string){
    return this.http.get(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${idPovincia}`)
  }
}
