import { Routes } from '@angular/router';
import { BasePage} from './pages/base/base.page'
import { HomePage } from './pages/home/home.page';
import { AnimalInfoPage } from './pages/animal-info/animal-info.page';
import { EventsPage } from './pages/events/events.page';
import { PerfilPage } from './pages/perfil/perfil.page';
import { TriviaPage } from './pages/trivia/trivia.page';
import { MapaPage } from './pages/mapa/mapa.page';
import {privateGuard,publicGuard} from '../app/common/services/auth.guard';
import { InfoZooPage } from './pages/info-zoo/info-zoo.page';


export const routes: Routes = [
  {
    path: 'app',

   component: BasePage,
   children: [
    { path:'home', component:HomePage},
    { path:'animal-info/:id', component:AnimalInfoPage},
    {path:'events', component:EventsPage},
    {path:'perfil', component:PerfilPage},
    {path:'trivia', component:TriviaPage},
    {path:'mapa', component:MapaPage},
    {path:'info-zoo', component:InfoZooPage},
   ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {

    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then( m => m.RegistrarsePage)
  },
  {
    path:'**',
    redirectTo:''
  },




];
