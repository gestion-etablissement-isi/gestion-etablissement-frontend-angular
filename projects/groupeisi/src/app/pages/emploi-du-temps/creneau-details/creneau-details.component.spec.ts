import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreneauDetailsComponent } from './creneau-details.component';

describe('CreneauDetailsComponent', () => {
  let component: CreneauDetailsComponent;
  let fixture: ComponentFixture<CreneauDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreneauDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreneauDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
