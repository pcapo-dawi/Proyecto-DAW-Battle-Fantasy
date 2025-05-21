import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsHeaderComponent } from './missions-header.component';

describe('MissionsHeaderComponent', () => {
  let component: MissionsHeaderComponent;
  let fixture: ComponentFixture<MissionsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
