import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterFormComponent } from './printer-form.component';

describe('PrinterFormComponent', () => {
  let component: PrinterFormComponent;
  let fixture: ComponentFixture<PrinterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
