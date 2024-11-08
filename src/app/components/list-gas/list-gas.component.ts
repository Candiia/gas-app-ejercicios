import { Component, Input, OnInit } from '@angular/core';
import { GasAppService } from '../../services/gas-app.service';
import { Gasolinera } from '../../models/gas-app.dto';
import { FormControl } from '@angular/forms';
import { CodePostalService } from '../../services/postal-code.service';
import { map, Observable, startWith } from 'rxjs';
import { CodeList } from '../../models/code-postal.interface';
import { ComunidadesAutonomas } from '../../models/comunidades-autonomas.interfaces';
import { Provincias } from '../../models/provincias.interfaces';

@Component({
  selector: 'app-list-gas',
  templateUrl: './list-gas.component.html',
  styleUrl: './list-gas.component.css'
})
export class ListGasComponent implements OnInit {

  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  listadoComunidades: ComunidadesAutonomas[] = [];
  listPronvicias: Provincias[] = [];
  codigoPostal = '';
  listaPostalCode: CodeList[] = [];
  listadoGasolineras: Gasolinera[] = [];
  listadoGasolinerasOriginal: Gasolinera[] = [];
  @Input() precioMinimo = 0;
  @Input() precioMax = 0;
  tipoCombustible: string = '';
  comunidadMarcada = true;
  constructor(private gasService: GasAppService, private postalService: CodePostalService) { }

  ngOnInit() {
    this.gasService.getGasList().subscribe((respuesta) => {
      const respuestaEnString = JSON.stringify(respuesta);
      let parsedData;
      try {
        parsedData = JSON.parse(respuestaEnString);
        let arrayGasolineras = parsedData['ListaEESSPrecio'];
        this.listadoGasolineras = this.cleanProperties(arrayGasolineras);
        this.listadoGasolinerasOriginal = [...this.listadoGasolineras];
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    this.gasService.getComunidadesList().subscribe((respuesta) => {
      this.listadoComunidades = respuesta;
    });

    this.postalService.getPostalCode().subscribe((respuesta) => {
      this.listaPostalCode = respuesta;
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
  }

  private cleanProperties(arrayGasolineras: any) {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      const gasolinera = new Gasolinera(
        gasolineraChusquera['IDEESS'],
        gasolineraChusquera['Rótulo'],
        gasolineraChusquera['Precio Gasolina 95 E5'].replace(',', '.'),
        gasolineraChusquera['Precio Gasoleo A'].replace(',', '.'),
        gasolineraChusquera['C.P.'],
        gasolineraChusquera['Municipio'],
        gasolineraChusquera['Dirección'],
        gasolineraChusquera['Localidad'],
        this.capitalizeFirstLetter(gasolineraChusquera['Provincia']),
        gasolineraChusquera['Latitud'],
        gasolineraChusquera['Longitud'],
        gasolineraChusquera['Horario'],
        gasolineraChusquera['Remisión'],
        gasolineraChusquera['Precio Biodiesel'].replace(',', '.'),
        gasolineraChusquera['Precio Gasolina 98 E5'].replace(',', '.'),
        gasolineraChusquera['Precio Hidrogeno'].replace(',', '.'),
        gasolineraChusquera['Precio Gasoleo B'].replace(',', '.'),
        gasolineraChusquera['iDMunicipio'],
        gasolineraChusquera['iDProvincia'],
        gasolineraChusquera['iDCCAA'],
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  aplicarFiltroPrecio() {
    const min = this.precioMinimo || 0;
    const max = this.precioMax || Number.MAX_VALUE;
    const tipo = this.tipoCombustible;

    this.listadoGasolineras = this.listadoGasolinerasOriginal.filter((gasolinera) => {
      let precioCombustible;

      switch (tipo) {
        case 'Gasolina 95':
          precioCombustible = parseFloat(gasolinera.price95);
          break;
        case 'Gasoleo A':
          precioCombustible = parseFloat(gasolinera.priceGasoleoA);
          break;
        case 'Gasoleo B':
          precioCombustible = parseFloat(gasolinera.priceGasoleoB);
          break;
        case 'Gasolina 98':
          precioCombustible = parseFloat(gasolinera.priceGasolina98);
          break;
        case 'Hidrogeno':
          precioCombustible = parseFloat(gasolinera.priceHidrogeno);
          break;
        case 'Biodiesel':
          precioCombustible = parseFloat(gasolinera.priceBiodiesel);
          break;
        default:
          return false;
      }
      return !isNaN(precioCombustible) && precioCombustible >= min && precioCombustible <= max;
    });
  }

  aplicarFiltroComunidades(iDDCCA: string) {
    this.gasService.getListPorUnComun(iDDCCA).subscribe((response) => {
      const respuesString = JSON.stringify(response);
      let paser;
      paser = JSON.parse(respuesString);
      let listGasol = paser['ListaEESSPrecio'];
      this.listadoGasolineras = this.cleanProperties(listGasol);
      this.listadoGasolinerasOriginal = this.listadoGasolineras;
    })
 
    this.buscarProvinciaComunidad(iDDCCA);

  }

  buscarProvinciaComunidad(iDCCAA: string){
    this.gasService.getProvinciasList(iDCCAA).subscribe((response) => {
      this.listPronvicias = response;
    })
  }
  aplicarFiltroProvincias(idProvincias: string) {
    this.gasService.getPorUnaProvincia(idProvincias).subscribe((response) => {
      const respuesString = JSON.stringify(response);
      let paser;
      paser = JSON.parse(respuesString);
      let listGasol = paser['ListaEESSPrecio'];
      this.listadoGasolineras = this.cleanProperties(listGasol);
      this.listadoGasolinerasOriginal = this.listadoGasolineras;
    })
  }

  filter(value: string): string[] {
    return this.listaPostalCode
      .map((codeList) => codeList.codigo_postal.toString())
      .filter((codigoPostal) => codigoPostal.includes(value));
  }


  filterPostalCode() {
    if (this.codigoPostal == '') {
      this.listadoGasolineras = this.listadoGasolinerasOriginal;
    } else {
      this.listadoGasolineras = this.listadoGasolinerasOriginal.filter(gasolinera =>
        gasolinera.postalCode === this.codigoPostal
      );
    }
  }
}



