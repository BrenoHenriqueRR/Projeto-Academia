import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnPlanosComponent } from './pn-planos.component';

describe('PnPlanosComponent', () => {
  let component: PnPlanosComponent;
  let fixture: ComponentFixture<PnPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnPlanosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
