import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilClassesComponent } from './accueil-classes.component';

describe('AccueilClassesComponent', () => {
  let component: AccueilClassesComponent;
  let fixture: ComponentFixture<AccueilClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
