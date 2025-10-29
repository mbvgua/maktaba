import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Error404 } from './components/error404/error404';
import { ContactUs } from './components/contact-us/contact-us';
import { Courses } from './components/courses/courses';
import { CourseSpecific } from './components/course-specific/course-specific';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';

export const routes: Routes = [
  {
    path: '',
    component: Homepage,
  },
  // contact us page
  {
    path: 'contact-us',
    component: ContactUs,
  },
  {
    path: 'courses',
    component: Courses,
  },
  // this will be a child component of courses
  {
    path: 'courses/course-id',
    component: CourseSpecific,
  },
  {
  path:"register",
  component:Register,
  },
  {
  path:"login",
  component:Login,
  },
  {
  path:"forgot-password",
  component:ForgotPassword,
  },

  // error 404 page
  {
    path: '**',
    component: Error404,
  },
];
