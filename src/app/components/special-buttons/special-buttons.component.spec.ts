import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialButtonsComponent } from './special-buttons.component';

describe('SpecialButtonsComponent', () => {
  let component: SpecialButtonsComponent;
  let fixture: ComponentFixture<SpecialButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
