import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpChartComponent } from './exp-chart.component';

describe('ExpChartComponent', () => {
  let component: ExpChartComponent;
  let fixture: ComponentFixture<ExpChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
