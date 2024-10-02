import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule], // Import de NgxChartsModule ici
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {

  // Données pour le chart pie
  public pieData: any[] = [];

  // Options du chart pie
  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  // Options de couleur
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#823952', '#9e5d64', '#83A2E0', '#9c7fa3', '#b6e1f3']
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Récupération des données depuis le service OlympicService
    this.olympicService.getOlympics().subscribe((olympics) => {
      if (olympics) {
        this.pieData = olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
        }));
      }
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
