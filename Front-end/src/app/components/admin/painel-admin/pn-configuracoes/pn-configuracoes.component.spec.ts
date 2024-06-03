import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnConfiguracoesComponent } from './pn-configuracoes.component';

describe('PnConfiguracoesComponent', () => {
  let component: PnConfiguracoesComponent;
  let fixture: ComponentFixture<PnConfiguracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnConfiguracoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnConfiguracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
