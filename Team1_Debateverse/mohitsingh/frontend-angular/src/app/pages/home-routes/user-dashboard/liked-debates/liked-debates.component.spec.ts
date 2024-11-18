import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedDebatesComponent } from './liked-debates.component';

describe('LikedDebatesComponent', () => {
  let component: LikedDebatesComponent;
  let fixture: ComponentFixture<LikedDebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LikedDebatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LikedDebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
