import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectJobListingComponent } from './select-job-listing.component';

describe('SelectJobListingComponent', () => {
  let component: SelectJobListingComponent;
  let fixture: ComponentFixture<SelectJobListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectJobListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectJobListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
