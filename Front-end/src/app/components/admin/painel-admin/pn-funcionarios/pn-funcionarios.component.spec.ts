import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnFuncionariosComponent } from './pn-funcionarios.component';

describe('PnFuncionariosComponent', () => {
  let component: PnFuncionariosComponent;
  let fixture: ComponentFixture<PnFuncionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnFuncionariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnFuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
