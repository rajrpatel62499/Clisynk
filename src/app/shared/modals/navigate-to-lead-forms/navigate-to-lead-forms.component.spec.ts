import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateToLeadFormsComponent } from './navigate-to-lead-forms.component';

describe('NavigateToLeadFormsComponent', () => {
  let component: NavigateToLeadFormsComponent;
  let fixture: ComponentFixture<NavigateToLeadFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigateToLeadFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateToLeadFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
