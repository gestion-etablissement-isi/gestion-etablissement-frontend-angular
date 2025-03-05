import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilCoursComponent } from './accueil-cours.component';

describe('AccueilCoursComponent', () => {
  let component: AccueilCoursComponent;
  let fixture: ComponentFixture<AccueilCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilCoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
