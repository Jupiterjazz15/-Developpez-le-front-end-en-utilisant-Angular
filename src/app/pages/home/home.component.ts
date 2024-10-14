import { Component, OnInit } from '@angular/core';
// Importation depuis Anglr du décorateur Component et de l'interface OnInit.
// L'interface permet d'implémenter la mthd ngOnInit() utilisée pr
// initialiser les propriétes du composant au moment de sa création.
import { Observable, of } from 'rxjs';
// Importation depuis la bibliothèque RxJS des éléments Observable et of.
// - Observable : Une entité qui émet des données au fil du temps et à laquelle on peut s'abonner
//   pour recevoir ces données (asynchrone).
// - of : fonction qui permet de créer un Observable émettant des valeurs statiques
import { Olympic } from 'src/app/core/models/Olympic';
// Importation du modèle/interface Olympic
import { OlympicService } from 'src/app/core/services/olympic.service';
// Importation du service OlympicService
// Il fournit les mthds pour accéder et manipuler les données des Jeux Olympiques.
import { PieChartComponent } from 'src/app/pie-chart/pie-chart.component';
//Importation du composant PieChartComponent


@Component({
// Décorateur utilisé pour définir les métadonnées du composant app-home
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [PieChartComponent],
  // dans imports : ajouter les composants, directives ou pipes qui peuvent être utilisés
  standalone: true,
  // définition du composant comme autonome (n'a pas besoin d'être déclaré dans un NgModule traditionnel)
  // on simplifie l'architecture en créant des composants réutilisables sans inclusion dans un module spécifique
})

export class HomeComponent implements OnInit {

  // DECLARATION ET INITIALISATION DES PROPRIETES
  public olympics$: Observable<Olympic[] | null> = of([]);
  // propriété public intialisée avec un Observable
  // <Olympic[] | null> : la valeur stockée sera soit un tableau d'instances d'Olympic, soit null
  // of([]) : émet un Observable qui contient un tableau vide
  // cela évite des erreurs potentielles si le composant essaie d'accéder aux données
  // avant qu'elles ne soient réellement disponibles
  public olympicsCount: number = 0;
  // propriété public qui stocke le nombre de pays participants aux JO
  public participationsCount: number = 0;
  // propriété public qui stocke le nombre total de participations aux JO

  //DECLARATION DU CONSTRUCTEUR ET INITIALISATION DE LA PROPRIETE OLYMPICSERVICE
  constructor(private olympicService: OlympicService) {}
  // Injection du service OlympicService via le constructeur
  // l'instance d'OlympicService sera accessible dans la classe par le nom olympicService

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
     // Sur l'instance de la classe HomeComponent, j'accède à la propriété olympics$
     // je lui assigne la valeur retournée par la méthode getOlympics() du service OlympicService
     // cet valeur est un Observable non modifiable (en lecture seule)

    this.olympicService.loadInitialData().subscribe(() => {
    // Sur l'instance de la classe HomeComponent, j'accède à la méthode loadInitialData() du service OlympicService
    // je m'abonne à l'Observable retourné par cette méthode

      this.olympicsCount = this.olympicService.countOlympics();
      // Sur l'instance de la classe HomeComponent, j'accède à la propriété olympicsCount
      // je lui assigne la valeur retournée par la méthode countOlympics() du service OlympicService

      this.participationsCount = this.olympicService.countParticipations();
      // Sur l'instance de la classe HomeComponent, j'accède à la propriété participationsCount
      // je lui assigne la valeur retournée par la méthode countParticipations() du service OlympicService
    });
  }
}
