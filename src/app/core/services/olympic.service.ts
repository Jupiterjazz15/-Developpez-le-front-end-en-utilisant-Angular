import { HttpClient } from '@angular/common/http';
// j'importe le service HttpClient d'Angular pour faire des requêtes HTTP
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
// j'importe le modèle Olympic

@Injectable({
  providedIn: 'root',
})

export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  // propriété privée qui stocke l'URL du fichier JSON qui contient les données des Jeux Olympiques

  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  // propriété avec un $ pour indiquer qu'il s'agit d'un Observable.
  // BehaviorSubject : type de données Observable + permet de stocker la dernière valeur émise par celu-ci.
  // cette valeur sera soit une instance d'Olympic, soit null si aucune donnée n'est disponible.
  // on initialise cette propriété avec null.

  private olympics: Olympic[] | null = null;
  // propriété qui stocke les données des JO sous forme de tableau d'instances d'Olympic

  constructor(private http: HttpClient) {}
  // à l'aide d'un constructeur, j'injecte le service d'Angular nommé HttpClient (utilisé pr faire des requêtes HTTP)

  loadInitialData() {
  // méthode pour récupérer les données du fichier JSON et returner un Observable
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // this.http.get = utilisation du service http avec une requête GET.
      // <Olympic[]> = je demande à ce que ma réponse soit sous la forme d'un tableau d'instances d'Olympic.
      // this.olympicUrl = je lui passe l'URL du fichier JSON
      // .pipe = on utilise l'opérateur pipe de RxJS pr transformer un Observable émis par la méthode http.get() en un nouvel Observable qui a été modifié par les opérateurs tap ou catchError

      tap((value) => {
        this.olympics = value;
        // je stocke les données des JO dans la propriété olympics
        this.olympics$.next(value);
        }),
      // on utilise l'opérateur tap de RxJS
      // cet opérateur prend en argument une fonction lambda dont le paramètre est la valeur émise par l'Observable
      // cad un tableau d'instances d'Olympic
      // cette fonction sera exécutée à chaque fois que l'Observable émettra
      // 1 : on intercepte chaque valeur émise par l'Observable 2 : on exécute la fonction fournie 3 : on renvoie la même valeur sans la modifier.

      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })

    );
  }

  getOlympics() {
  // méthode pr convertir un BehaviorSubject en un Observable disponible en lecture seule pr que les composants puissent s'y abonner SANS modifier les données.
    return this.olympics$.asObservable();
    // méthd de la classe BehaviorSubject pr obtenir un Observable à partir d'un BehaviorSubject
  }

  getOlympicByName(name: string): Olympic | undefined {
  // mthd pour récupérer un objet Olympic par son nom
    const olympics = this.getOlympicsValue();

    if (!olympics) {
    // on vérifie si la valeur d'olympics est "falsy" cad false, O,nul etc.
      throw new Error('No olympics data available!');
    }

    const foundOlympic = olympics.find(olympic => olympic.country === name);

    if (!foundOlympic) {
      throw new Error('Olympic not found!');
    }

    return foundOlympic;
  }

  countOlympics(): number {
  // méthode pr compter le nbr de pays participants aux JO
    const olympics = this.getOlympicsValue();

    return olympics ? olympics.length : 0;
    // opérateur ternaire : si olympics n'est pas null, on retourne la longueur du tableau, sinon on retourne 0
  }

  countParticipations(): number {
    const olympics = this.getOlympicsValue();

    if (olympics) {
        return olympics[0].participations ? olympics[0].participations.length : 0;
    }
    return 0;
  }

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
  }

  private getOlympicsValue(): Olympic[] {
  //je fais une mthd privée qui récupère la valeur actuelle stockée dans le BehaviorSubject sans avoir besoin de s'abonner à l'Observable
    const olympics = this.olympics$.getValue();
    if (!olympics) {
      throw new Error('No olympics data available!');
    }
    return olympics;
  }

}
