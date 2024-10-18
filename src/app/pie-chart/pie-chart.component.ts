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
  // Données pour le graphique pie où chaque entrée représente un objet avec
  // une propriété name (nom du pays) et une propriété value (somme des médailles)
  public pieChartData: ChartData[] = [];

  public view: [number, number] = [430, 400];
  public showLabels = true;
  public isDoughnut = false;
  public activeData: ChartData | null = null;
  // Pour l'attribut [scheme] edmande un objet de type Color qui a une clé dont
  // la valeur est de type ScaleType
  public colorScheme: Color = {
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

  //Méthode de redirection vers la page de détails du pays sélectionné
  onSelect(data: ChartData): void {
    this.activeData = data;
    this.router.navigate(['/details', data.name]);
  }
}
