import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlayHeaderComponent } from './how-to-play-header.component';

describe('HowToPlayHeaderComponent', () => {
  let component: HowToPlayHeaderComponent;
  let fixture: ComponentFixture<HowToPlayHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToPlayHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToPlayHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
