import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalityComponent } from './add-locality.component';

describe('AddLocalityComponent', () => {
  let component: AddLocalityComponent;
  let fixture: ComponentFixture<AddLocalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLocalityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
