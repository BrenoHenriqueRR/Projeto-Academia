import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnFinanceiroComponent } from './pn-financeiro.component';

describe('PnFinanceiroComponent', () => {
  let component: PnFinanceiroComponent;
  let fixture: ComponentFixture<PnFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
