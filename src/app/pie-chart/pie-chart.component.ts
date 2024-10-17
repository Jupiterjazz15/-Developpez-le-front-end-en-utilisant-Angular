import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartData } from 'src/app/core/models/ChartData';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {

  public pieChartData: ChartData[] = [];

  view: [number, number] = [430, 400];
  showLabels = true;
  isDoughnut = false;
  activeData: ChartData | null = null;
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#823952', '#9e5d64', '#83A2E0', '#9c7fa3', '#b6e1f3']
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((olympics) => {
      if (olympics) {
        this.pieChartData = olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
        }));
      }
    });
  }

  onSelect(data: ChartData): void {
    this.activeData = data;
    this.router.navigate(['/details', data.name]);
  }
}
