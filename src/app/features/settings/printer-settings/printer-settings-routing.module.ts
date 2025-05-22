import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrinterFormComponent } from './printer-form/printer-form.component';

// const routes: Routes = [];
const routes: Routes = [
  {
    path: '',
    component: PrinterFormComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrinterSettingsRoutingModule { }
