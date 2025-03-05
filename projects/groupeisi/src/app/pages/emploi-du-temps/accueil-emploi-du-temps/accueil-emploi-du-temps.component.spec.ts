import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilEmploiDuTempsComponent } from './accueil-emploi-du-temps.component';

describe('AccueilEmploiDuTempsComponent', () => {
  let component: AccueilEmploiDuTempsComponent;
  let fixture: ComponentFixture<AccueilEmploiDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilEmploiDuTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilEmploiDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
