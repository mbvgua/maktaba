import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Error404 } from './components/error404/error404';

export const routes: Routes = [
  {
    path:"",
    component:Homepage
  },

  // error 404 page
  {
    path:"**",
    component: Error404
  },
];
