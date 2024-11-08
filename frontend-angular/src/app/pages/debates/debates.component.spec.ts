import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebatesComponent } from './debates.component';

describe('DebatesComponent', () => {
  let component: DebatesComponent;
  let fixture: ComponentFixture<DebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
