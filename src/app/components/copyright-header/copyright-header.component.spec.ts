import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightHeaderComponent } from './copyright-header.component';

describe('CopyrightHeaderComponent', () => {
  let component: CopyrightHeaderComponent;
  let fixture: ComponentFixture<CopyrightHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyrightHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyrightHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
