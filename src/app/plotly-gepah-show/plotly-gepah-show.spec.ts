import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyGepahShow } from './plotly-gepah-show';

describe('PlotlyGepahShow', () => {
  let component: PlotlyGepahShow;
  let fixture: ComponentFixture<PlotlyGepahShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotlyGepahShow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotlyGepahShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
