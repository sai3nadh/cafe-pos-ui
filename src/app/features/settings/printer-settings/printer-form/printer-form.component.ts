import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrinterConfig } from '../models/printer-config.model';
import { CommonModule } from '@angular/common';
import { PrinterService } from '../../../../shared/services/printer.service';
import { PrintingStatusService } from '../../../../shared/services/printing-status.service';
// import { PrinterService } from '../services/printer.service';

@Component({
  selector: 'app-printer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './printer-form.component.html',
  styleUrl: './printer-form.component.scss'
})
export class PrinterFormComponent {
  form: FormGroup;
  config!: PrinterConfig;
  editMode = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private printerService: PrinterService
        ,private printingStatusService: PrintingStatusService

  ) {
    this.form = this.fb.group({
      printerEnabled: [false],
      receiptPrinterIp: [''],
      receiptPrinterPort: [9100],
      kitchenPrinterIp: ['']
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.isLoading = true;
    this.printerService.getConfig().subscribe({
      next: (data) => {
        this.config = data;
        this.form.patchValue(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load config';
        this.isLoading = false;
      }
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;
    this.printerService.updateConfig(this.form.value).subscribe({
      next: () => {
            this.printingStatusService.setStatus(this.form.value.printerEnabled); // Notify header
        // localStorage.setItem('printingEnabled', this.form.value.printerEnabled.toString());
        this.editMode = false;
        this.isSaving = false;
        this.config = this.form.value;
      },
      error: () => {
        this.error = 'Failed to save configuration';
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.form.patchValue(this.config);
    this.editMode = false;
  }
}
