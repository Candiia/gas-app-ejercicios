import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGasComponent } from './components/list-gas/list-gas.component';
import { PageNotFoundComponentComponent } from './shared/page-not-found-component/page-not-found-component.component';

const routes: Routes = [
  {path: 'gas', component: ListGasComponent},
  {path: '', redirectTo: '/gas', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
