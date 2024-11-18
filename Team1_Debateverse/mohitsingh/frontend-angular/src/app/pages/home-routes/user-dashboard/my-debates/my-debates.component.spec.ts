import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDebatesComponent } from './my-debates.component';

describe('MyDebatesComponent', () => {
  let component: MyDebatesComponent;
  let fixture: ComponentFixture<MyDebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyDebatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyDebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
