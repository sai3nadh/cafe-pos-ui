import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierFormComponent } from './modifier-form.component';

describe('ModifierFormComponent', () => {
  let component: ModifierFormComponent;
  let fixture: ComponentFixture<ModifierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
