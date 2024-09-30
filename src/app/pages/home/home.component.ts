import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieChartComponent } from 'src/app/pie-chart/pie-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [PieChartComponent],
  standalone: true,
})

export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of([]);
  public olympicsCount: number = 0;
  // propriété qui stocke le nombre d'Olympic
  public participationsCount: number = 0;
  // propriété qui stocke de Participation
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicService.loadInitialData().subscribe(() => {
    // on souscrit à la méthode loadInitialData() du service pour récupérer les données du JSON. Cette mthd  renvoie un Observable qui émettra des valeurs qd la requête sera complétée
    // on s'abonne à l'Observable car nous voulons effectuer une action lorsque les données sont récupérées avec succès.
    // qd l'observable émet une valeur, on exécute la fonction fléchée passée en argument
      this.olympicsCount = this.olympicService.countOlympics();

      // on met à jour la propriété olympicsCount avec le nombre d'olympiques récupérés
      this.participationsCount = this.olympicService.countParticipations();
    });
  }
}
