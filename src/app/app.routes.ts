import { Routes } from '@angular/router';
import { CreateNewSurveyTemplate } from './components/create-new-survey-template/create-new-survey-template';
import { Home } from './components/home/home';
import { SingleSurveyView } from './components/single-survey-view/single-survey-view';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "create_new_survey", component: CreateNewSurveyTemplate },
    { path: "showSingleSurvey/:id", component: SingleSurveyView },
    { path: "**", redirectTo: "" }
];
