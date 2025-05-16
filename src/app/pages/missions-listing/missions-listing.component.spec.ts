import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsListingComponent } from './missions-listing.component';

describe('MissionsListingComponent', () => {
  let component: MissionsListingComponent;
  let fixture: ComponentFixture<MissionsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
