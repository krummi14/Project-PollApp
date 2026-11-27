import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Button } from '../../shared/button/button';
import { AddNewQuestion, QuestionForm } from '../../create-new-survey-template/add-new-question/add-new-question';
import { DeleteButton } from '../../shared/delete-button/delete-button';
import { SecondButton } from '../../shared/second-button/second-button';
import { SupabaseService } from '../../shared/services/supabase';
import { Surveytemplate } from '../../shared/templates/surveytemplate';
import { SURVEY_CATEGORIES } from '../../shared/utils/survey-categories';
import { Router } from '@angular/router';
import { Dialog } from '../../shared/services/dialog';
/**
 * Form for creating and publishing a new survey.
 *
 * @remarks
 * Manages the name, end date, category, description and questions of the survey.
 * After successful publishing, a confirmation is shown briefly
 * and the form is reset.
 */
@Component({
  selector: 'app-survey-form',
  imports: [Button, AddNewQuestion, ReactiveFormsModule, DeleteButton, SecondButton],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})

export class SurveyForm implements OnDestroy {
  /** Available survey categories for selection. */
  readonly categories = SURVEY_CATEGORIES;
  /** Whether the "Survey published" confirmation is visible. */
  readonly publishedConfirmationIsVisible = signal(false);

  /** Reactive form containing all fields of the new survey. */
  surveyForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(new Date(2026, 10, 25)),
    category: new FormControl('', Validators.required),
    description: new FormControl(''),
    question: new FormArray([this.createQuestionForm()]),
  });

  /** Shortcut to the `FormArray` containing all questions. */
  readonly questions = this.surveyForm.controls.question;
  /** Service for accessing the Supabase database. */
  surveyService: SupabaseService = inject(SupabaseService);
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);
  /** Timer handle for automatically hiding the publish confirmation. */
  private publishedConfirmationTimeout?: ReturnType<typeof setTimeout>;

  /**
   * Validates the form and publishes the survey to the database.
   *
   * @remarks
   * If the form is invalid, all fields are marked as touched and nothing is saved.
   * After saving successfully, a confirmation is shown and the form
   * (except the category) is reset.
   * Errors while saving are logged to the console.
   *
   * @returns A promise that resolves once the operation has completed
   */
  async onSubmit() {
    if (!this.surveyForm.valid) {
      this.surveyForm.markAllAsTouched();
      return;
    }
    try {
      const value = this.surveyForm.getRawValue();
      const surveyData = new Surveytemplate({
        name: value.name ?? '',
        date: value.date ? new Date(value.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: value.category ?? '',
        description: value.description ?? '',
        questions: value.question.map((question) => ({
          question: question.question ?? '',
          multipleChoice: question.multipleChoice ?? false,
          answers: question.answers.map((answer) => answer ?? ''),
        })),
      });
      const createdSurvey = await this.surveyService.createSurvey(surveyData);
      if (createdSurvey.id == null) {
        throw new Error('Saved survey is missing an ID.');
      }

      this.publishedConfirmationIsVisible.set(true);
      this.publishedConfirmationTimeout = setTimeout(() => {
        this.dialog.closeCreateSurveyDialog();
        void this.router.navigate(['/vote', createdSurvey.id]);
      }, 3_000);
    } catch (error) {
      console.error('Error while publishing survey:', error);
    }
  }

  /** Clears a still running confirmation timer when the component is destroyed. */
  ngOnDestroy() {
    if (this.publishedConfirmationTimeout) {
      clearTimeout(this.publishedConfirmationTimeout);
    }
  }

  /** Adds a new, empty question to the form. */
  addQuestion() {
    this.questions.push(this.createQuestionForm());
  }

  /**
   * Creates a new form group for a question with two empty answers.
   *
   * @returns The newly created {@link QuestionForm}
   */
  private createQuestionForm(): QuestionForm {
    return new FormGroup({
      question: new FormControl(''),
      multipleChoice: new FormControl(false),
      answers: new FormArray([
        new FormControl(''),
        new FormControl(''),
      ]),
    });
  }

  /**
   * Resets a single field of the form.
   *
   * @param field - Name of the field: `'name'`, `'date'` or `'describing'`
   */
  delete(field: string) {
    switch (field) {
      case 'name':
        this.surveyForm.controls.name.reset('');
        break;
      case 'date':
        this.surveyForm.controls.date.reset(new Date(2026, 10, 31));
        break;
      case 'describing':
        this.surveyForm.controls.description.reset('');
        break;
      default:
        break;
    }
  }
}
