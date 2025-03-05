import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilMatieresComponent } from './accueil-matieres.component';

describe('AccueilMatieresComponent', () => {
  let component: AccueilMatieresComponent;
  let fixture: ComponentFixture<AccueilMatieresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilMatieresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilMatieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
