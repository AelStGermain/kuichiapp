import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VeterinariasPage } from './veterinarias.page';

describe('VeterinariasPage', () => {
  let component: VeterinariasPage;
  let fixture: ComponentFixture<VeterinariasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VeterinariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
