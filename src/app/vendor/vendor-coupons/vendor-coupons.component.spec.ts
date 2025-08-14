import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCouponsComponent } from './vendor-coupons.component';

describe('VendorCouponsComponent', () => {
  let component: VendorCouponsComponent;
  let fixture: ComponentFixture<VendorCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
