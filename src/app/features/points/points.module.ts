// src/app/features/points/points.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PointsComponent } from './points.component';
import { AuthGuard } from '../../core/guards/auth.guard';

@NgModule({
  declarations: [PointsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PointsComponent,
        canActivate: [AuthGuard]
      }
    ])
  ]
})
export class PointsModule { }
