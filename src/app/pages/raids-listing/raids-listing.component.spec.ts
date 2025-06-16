import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidsListingComponent } from './raids-listing.component';

describe('RaidsListingComponent', () => {
  let component: RaidsListingComponent;
  let fixture: ComponentFixture<RaidsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaidsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
