import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFormDeletedComponent } from './lead-form-deleted.component';

describe('LeadFormDeletedComponent', () => {
  let component: LeadFormDeletedComponent;
  let fixture: ComponentFixture<LeadFormDeletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadFormDeletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadFormDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
