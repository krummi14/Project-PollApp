import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CreateNewSurveyTemplate } from './components/create-new-survey-template/create-new-survey-template';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "create_new_survey", component: CreateNewSurveyTemplate },
    { path: "**", redirectTo: "" }
];
