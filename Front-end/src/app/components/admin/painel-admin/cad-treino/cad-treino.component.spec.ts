import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadTreinoComponent } from './cad-treino.component';

describe('CadTreinoComponent', () => {
  let component: CadTreinoComponent;
  let fixture: ComponentFixture<CadTreinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadTreinoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadTreinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
