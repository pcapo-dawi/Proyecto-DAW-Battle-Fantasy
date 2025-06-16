import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidsHeaderComponent } from './raids-header.component';

describe('RaidsHeaderComponent', () => {
  let component: RaidsHeaderComponent;
  let fixture: ComponentFixture<RaidsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaidsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
