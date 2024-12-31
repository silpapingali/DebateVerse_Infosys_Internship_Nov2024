import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDebatesComponent } from './all-debates.component';

describe('AllDebatesComponent', () => {
  let component: AllDebatesComponent;
  let fixture: ComponentFixture<AllDebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDebatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
