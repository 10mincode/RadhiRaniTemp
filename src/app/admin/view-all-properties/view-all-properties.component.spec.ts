import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPropertiesComponent } from './view-all-properties.component';

describe('ViewAllPropertiesComponent', () => {
  let component: ViewAllPropertiesComponent;
  let fixture: ComponentFixture<ViewAllPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
