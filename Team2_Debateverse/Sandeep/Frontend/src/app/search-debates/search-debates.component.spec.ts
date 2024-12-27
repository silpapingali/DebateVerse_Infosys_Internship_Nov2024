import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDebatesComponent } from './search-debates.component';

describe('SearchDebatesComponent', () => {
  let component: SearchDebatesComponent;
  let fixture: ComponentFixture<SearchDebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDebatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
