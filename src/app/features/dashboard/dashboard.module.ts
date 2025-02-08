
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DashboardComponent } from './dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CollectorDashboardComponent } from './components/collector-dashboard/collector-dashboard.component';
import { RequestFormComponent } from './components/request-form/request-form.component';
import { RequestListComponent } from './components/request-list/request-list.component';

import { collectionRequestReducer } from '../../store/reducers/collection-request.reducer';
import { CollectionRequestEffects } from '../../store/effects/collection-request.effects';
import {CollectionEditComponent} from "./components/collection-edit/collection-edit.component";

@NgModule({
  declarations: [
    DashboardComponent,
    UserDashboardComponent,
    CollectorDashboardComponent,
    RequestFormComponent,
    RequestListComponent,
    CollectionEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ]),
    StoreModule.forFeature('collectionRequests', collectionRequestReducer),
    EffectsModule.forFeature([CollectionRequestEffects])
  ]
})
export class DashboardModule { }
