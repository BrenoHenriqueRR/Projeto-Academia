import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAnamneseComponent } from './cad-anamnese.component';

describe('CadAnamneseComponent', () => {
  let component: CadAnamneseComponent;
  let fixture: ComponentFixture<CadAnamneseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadAnamneseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadAnamneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
