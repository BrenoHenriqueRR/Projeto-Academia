import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnTreinoComponent } from './pn-treino.component';

describe('PnTreinoComponent', () => {
  let component: PnTreinoComponent;
  let fixture: ComponentFixture<PnTreinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnTreinoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PnTreinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
