import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnRelatoriosComponent } from './pn-relatorios.component';

describe('PnRelatoriosComponent', () => {
  let component: PnRelatoriosComponent;
  let fixture: ComponentFixture<PnRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnRelatoriosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
