import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestUploadsComponent } from './latest-uploads.component';

describe('LatestUploadsComponent', () => {
  let component: LatestUploadsComponent;
  let fixture: ComponentFixture<LatestUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestUploadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
