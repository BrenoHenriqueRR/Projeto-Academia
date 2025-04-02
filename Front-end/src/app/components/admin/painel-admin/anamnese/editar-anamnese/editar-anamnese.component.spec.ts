import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAnamneseComponent } from './editar-anamnese.component';

describe('EditarAnamneseComponent', () => {
  let component: EditarAnamneseComponent;
  let fixture: ComponentFixture<EditarAnamneseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAnamneseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarAnamneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
