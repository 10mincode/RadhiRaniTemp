import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestContactsComponent } from './latest-contacts.component';

describe('LatestContactsComponent', () => {
  let component: LatestContactsComponent;
  let fixture: ComponentFixture<LatestContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
