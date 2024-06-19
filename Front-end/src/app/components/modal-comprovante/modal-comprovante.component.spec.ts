import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComprovanteComponent } from './modal-comprovante.component';

describe('ModalComprovanteComponent', () => {
  let component: ModalComprovanteComponent;
  let fixture: ComponentFixture<ModalComprovanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComprovanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalComprovanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
