import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteChartComponent } from './vote-chart.component';

describe('VoteChartComponent', () => {
  let component: VoteChartComponent;
  let fixture: ComponentFixture<VoteChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
