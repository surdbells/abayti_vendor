import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSecurityComponent } from './vendor-security.component';

describe('VendorSecurityComponent', () => {
  let component: VendorSecurityComponent;
  let fixture: ComponentFixture<VendorSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
