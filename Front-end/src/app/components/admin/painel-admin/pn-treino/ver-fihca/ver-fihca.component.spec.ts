import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFihcaComponent } from './ver-ficha.component';

describe('VerFihcaComponent', () => {
  let component: VerFihcaComponent;
  let fixture: ComponentFixture<VerFihcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerFihcaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerFihcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
