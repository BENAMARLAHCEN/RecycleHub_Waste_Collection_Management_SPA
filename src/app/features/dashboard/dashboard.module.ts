// src/app/features/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CollectorDashboardComponent } from './components/collector-dashboard/collector-dashboard.component';
// import { RequestFormComponent } from './components/request-form/request-form.component';
// import { RequestListComponent } from './components/request-list/request-list.component';
// import { PointsOverviewComponent } from './components/points-overview/points-overview.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserDashboardComponent,
    CollectorDashboardComponent,
    // RequestFormComponent,
    // RequestListComponent,
    // PointsOverviewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ])
  ]
})
export class DashboardModule { }
