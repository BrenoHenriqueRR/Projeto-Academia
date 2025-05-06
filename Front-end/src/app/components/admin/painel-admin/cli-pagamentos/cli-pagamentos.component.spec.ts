import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliPagamentosComponent } from './cli-pagamentos.component';

describe('CliPagamentosComponent', () => {
  let component: CliPagamentosComponent;
  let fixture: ComponentFixture<CliPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CliPagamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CliPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
