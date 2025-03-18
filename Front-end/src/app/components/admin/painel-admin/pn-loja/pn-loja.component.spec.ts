import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnLojaComponent } from './pn-loja.component';

describe('PnLojaComponent', () => {
  let component: PnLojaComponent;
  let fixture: ComponentFixture<PnLojaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnLojaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnLojaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
