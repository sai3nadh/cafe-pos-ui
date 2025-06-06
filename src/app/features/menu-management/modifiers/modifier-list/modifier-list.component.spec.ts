import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierListComponent } from './modifier-list.component';

describe('ModifierListComponent', () => {
  let component: ModifierListComponent;
  let fixture: ComponentFixture<ModifierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
