import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartData } from 'src/app/core/models/ChartData';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})

export class LineChartComponent implements OnInit {

  public lineChartData: { name: string; series: ChartData[] }[] = [];

  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';

  private countryName: string | null = null;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('country');

    if (this.countryName) {
      this.olympicService.loadInitialData().subscribe(() => {
        const olympicData = this.olympicService.getOlympicByName(this.countryName!);

        if (olympicData) {
          this.lineChartData = [
            {
              name:  this.countryName ?? 'Unknown Country',
              series: olympicData.participations.map(participation => ({
                name: participation.year.toString(),
                value: participation.medalsCount
              }))
            }
          ];
        } else {
          console.error('Olympic data not found for country:', this.countryName);
        }
      });
    } else {
      console.error('Country name not provided!');
    }
  }

}
