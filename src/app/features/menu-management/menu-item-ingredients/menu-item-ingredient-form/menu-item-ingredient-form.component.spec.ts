import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemIngredientFormComponent } from './menu-item-ingredient-form.component';

describe('MenuItemIngredientFormComponent', () => {
  let component: MenuItemIngredientFormComponent;
  let fixture: ComponentFixture<MenuItemIngredientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemIngredientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemIngredientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
