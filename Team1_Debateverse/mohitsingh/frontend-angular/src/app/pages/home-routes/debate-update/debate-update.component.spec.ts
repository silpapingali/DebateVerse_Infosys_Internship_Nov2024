import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateUpdateComponent } from './debate-update.component';

describe('DebateUpdateComponent', () => {
  let component: DebateUpdateComponent;
  let fixture: ComponentFixture<DebateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebateUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
