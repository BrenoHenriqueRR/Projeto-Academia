import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfighomeComponent } from './confighome.component';

describe('ConfighomeComponent', () => {
  let component: ConfighomeComponent;
  let fixture: ComponentFixture<ConfighomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfighomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfighomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
