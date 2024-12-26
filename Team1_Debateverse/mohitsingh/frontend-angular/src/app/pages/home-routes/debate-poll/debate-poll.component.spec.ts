import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebatePollComponent } from './debate-poll.component';

describe('DebatePollComponent', () => {
  let component: DebatePollComponent;
  let fixture: ComponentFixture<DebatePollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebatePollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebatePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
