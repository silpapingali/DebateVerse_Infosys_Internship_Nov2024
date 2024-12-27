import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDebateComponent } from './create-debate.component';

describe('CreateDebateComponent', () => {
  let component: CreateDebateComponent;
  let fixture: ComponentFixture<CreateDebateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDebateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
