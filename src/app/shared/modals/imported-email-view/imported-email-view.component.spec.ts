import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedEmailViewComponent } from './imported-email-view.component';

describe('ImportedEmailViewComponent', () => {
  let component: ImportedEmailViewComponent;
  let fixture: ComponentFixture<ImportedEmailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedEmailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedEmailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
