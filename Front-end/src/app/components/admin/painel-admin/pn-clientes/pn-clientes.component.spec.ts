import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnClientesComponent } from './pn-clientes.component';

describe('PnClientesComponent', () => {
  let component: PnClientesComponent;
  let fixture: ComponentFixture<PnClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
