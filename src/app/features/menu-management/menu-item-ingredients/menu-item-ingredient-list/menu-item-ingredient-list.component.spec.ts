import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemIngredientListComponent } from './menu-item-ingredient-list.component';

describe('MenuItemIngredientListComponent', () => {
  let component: MenuItemIngredientListComponent;
  let fixture: ComponentFixture<MenuItemIngredientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemIngredientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemIngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
