import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemIngredientsComponent } from './menu-item-ingredients.component';

describe('MenuItemIngredientsComponent', () => {
  let component: MenuItemIngredientsComponent;
  let fixture: ComponentFixture<MenuItemIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemIngredientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
