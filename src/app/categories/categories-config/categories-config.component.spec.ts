import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesConfigComponent } from './categories-config.component';

describe('CategoriesConfigComponent', () => {
  let component: CategoriesConfigComponent;
  let fixture: ComponentFixture<CategoriesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
