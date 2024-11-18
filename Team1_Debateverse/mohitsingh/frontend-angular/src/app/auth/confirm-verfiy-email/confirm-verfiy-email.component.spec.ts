import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVerfiyEmailComponent } from './confirm-verfiy-email.component';

describe('ConfirmVerfiyEmailComponent', () => {
  let component: ConfirmVerfiyEmailComponent;
  let fixture: ComponentFixture<ConfirmVerfiyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmVerfiyEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmVerfiyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
