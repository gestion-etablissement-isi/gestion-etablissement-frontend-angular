import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilProfesseursComponent } from './accueil-professeurs.component';

describe('AccueilProfesseursComponent', () => {
  let component: AccueilProfesseursComponent;
  let fixture: ComponentFixture<AccueilProfesseursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilProfesseursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilProfesseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
