import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Error404 } from './components/error404/error404';
import { ContactUs } from './components/contact-us/contact-us';
import { Courses } from './components/courses/courses';
import { CourseSpecific } from './components/course-specific/course-specific';

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

  // error 404 page
  {
    path: '**',
    component: Error404,
  },
];
