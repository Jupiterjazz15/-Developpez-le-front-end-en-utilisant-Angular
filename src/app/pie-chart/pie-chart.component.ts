import { Component, OnInit } from '@angular/core';
// Importation depuis Anglr du décorateur Component et de l'interface OnInit.
// L'interface permet d'implémenter la mthd ngOnInit() utilisée pr
// initialiser les propriétes du composant au moment de sa création.
import { Router } from '@angular/router';
// j'importe le router nécessaire à la redirection
import { OlympicService } from 'src/app/core/services/olympic.service';
// Importation du service OlympicService
// Il fournit les mthds pour accéder et manipuler les données des Jeux Olympiques.
import { NgxChartsModule } from '@swimlane/ngx-charts';
// Importation du module principal de la bibliothèque ngx-charts
import { Color, ScaleType} from '@swimlane/ngx-charts';
// Importation des interfaces Color et  du types ScaleType depuis ngx-charts

@Component({
// Décorateur utilisé pour définir les métadonnées du composant pie-chart-component
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  // dans imports : ajouter les composants, modolues, directives ou pipes qui peuvent être utilisés
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {

  // DECLARATION ET INITIALISATION DES PROPRIETES

  public pieData: { name: string; value: number }[] = [];
  // propriété public qui stocke les données à afficher dans le graphique sous
  // la forme d'un tableau d'objets avec les propriétés name et value
  // initialisée avec un tableau vide


  view: [number, number] = [700, 400];
  // propriété qui stocke les dimensions du graphique
  showLabels = true;
  // propriété qui définit l'affichage des étiquettes
  isDoughnut = false;
  // propriété qui définit le type de graphique (camembert ou anneau)
   activeData: any;
  // propriété qui stocke les données actives du graphique
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#823952', '#9e5d64', '#83A2E0', '#9c7fa3', '#b6e1f3']
  };
  // propriété qui définit les couleurs du graphique

  //DECLARATION DU CONSTRUCTEUR ET INITIALISATION DE LA PROPRIETE OLYMPICSERVICE
  constructor(private olympicService: OlympicService, private router: Router) {}
  // dans le constructeur, j'injecte le service OlympicService et le router

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
    console.log('Navigating to:', data.name);
    this.router.navigate(['/details', data.name]);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
