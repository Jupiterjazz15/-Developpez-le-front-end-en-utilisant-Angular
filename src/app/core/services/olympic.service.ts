import { HttpClient } from '@angular/common/http';
// Importation depuis d'Anglr du service HttpClient pr faire des requêtes HTTP
// Qd requête HTTP est effectuée avec HttpClient, elle retourne un Observable
// qui émet les résultats de cette requête
import { Injectable } from '@angular/core';
// Importation depuis d'Anglr du décorateur Injectable qui marque une classe comme
// tel cad qu'elle peut être injectée dans d'autres classes (service ou compo)
import { BehaviorSubject } from 'rxjs';
// Importation depuis la bibl RxJS de ce type particulier de Subject (Observable)
// Utilisé pour stocker une valeur observable par d'autres parties de l'app.
// Cad qu'à chaque chgmt de valeur, tt abonné est notifié de la nvelle valeur.
import { catchError, tap } from 'rxjs/operators';
// Importation depuis la bibl RxJS de 2 opérateurs qui manipulent les flux de
// données liés aux Observables).
// catchError : intercepte les erreurs émises par une requête HTTP et définit
// un comportement de secours.
// j'importe le modèle Olympic
// tap : effectue des actions secondaires sur les valeurs émises par un Obsrv.
// Ne modifie pas la valeur, mais permet de faire des choses comme enregistrer
// des valeurs ou déclencher des effets secondaires.
import { Olympic } from 'src/app/core/models/Olympic';
// Importation du modèlè/interfacé Olympic


@Injectable({
  providedIn: 'root',
  // le service est injecté à la racine > dispo dans toute l'appli
})
// décorateur Injectable pr marquer la classe comme un service injectable
// indication que cette classe peut avoir des dépendances (autres services)

export class OlympicService {

  // DECLARATION ET INITIALISATION DES PROPRIETES
  private olympicUrl = './assets/mock/olympic.json';
  // propr privée initialisée avec le path fichier JSON contenant données des JO
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  // propriété privée intialisée avec un BS donc pour stocker la last valeur
  // émise et permettant aux abonnés de recevoir cette valeur immédiatement.
  // <Olympic[] | null> : la valeur stockée sera soit un tableaud'insatnces d'Olympic, soit null.
  // (null) : la valeur initiale du BehaviorSubject est null
  private olympics: Olympic[] | null = null;
  // propriété privée qui stocke les données des JO sous forme d'un tableau
  // d'instances d'Olympic et initialisée à null

  //DECLARATION DU CONSTRUCTEUR ET INITIALISATION DE LA PROPRIETE HTTP
  constructor(private http: HttpClient) {}
  // Injection du service HttpClient pr faire des requêtes HTTP) dans le constructeur.
  // l'instance de HttpClient sera accessible dans la classe par le nom http


  loadInitialData() {
  // méthode pour récupérer les données du fichier JSON et retourner un Observable
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // Sur l'instance de la classe OlympicService, j'accède à la propriété http,
      // qui est un objet HttpClient injecté via le constructeur.
      // http.get : utilisation du service HttpClient pr faire une requête GET.
      // <Olympic[]> : je spécifie que la réponse attendue est un tableau d'instances d'Olympic.
      // this.olympicUrl : sur l'instance de la classe OlympicService, j'accède à la propriété olympicUrl
      // et le passe sa valeur (l'URL du fichier JSON) en paramètre de la méthode get.
      // .pipe : utilisation de l'opérateur de RxJS pr transformer l'Observable intial émis par la méthode http.get()
      // en un nouvel Observable que je vais ensuite pouvoir modifier via les opérateurs tap ou catchError que
      // je passe en argument de la méthode pipe.
      // Ici, l'observalbe émet de données mais elle ne sont pas encore traitées
      tap((value) => {
        this.olympics = value;
        this.olympics$.next(value);
        }),
      // utilisation de l'opérateur tap de RxJS pour intercepter les données émises par l'Observable sans les modifier, simplement pour effectuer des actions dessus (souvent les stocker)
      // cet opérateur prend en argument une fonction lambda dont le paramètre est la valeur émise par l'Observable
      // cad un tableau d'instances d'Olympic : (5) [{…}, {…}, {…}, {…}, {…}]
      // cette fonction sera exécutée à chaque fois que l'Observable émettra
      // la fonction lambda va :
      // 1 : accèder à la propriété olympics de l'instance de la classe OlympicService et qui est un tableau d'instances d'Olympic et elle lui affecter la valeur émise par l'Observable (stockage local)
      // 2 : accèder à la propriété olympics$ de l'instance de la classe OlympicService et qui est un BehaviorSubject et on MAJ sa valeur avec la dernière valeur émise, ce qui permet à ts les abonnés de recevoir cette mise à jour.


      catchError((error, caught) => {
      // utilisation de l'opérateur catchError de RxJS pour intercepter les erreurs survenant dans un Observable.
      // cet opérateur prend en argument une fonction lambda dont les paramètres sont l'erreur survenue et  l'Observable lui-même qui a émis l'erreur
        alert('Erreur rencontrée' + error)
        // alert() est une fonction JavaScript native qui affiche une boîte de dialogue modale avec un message.
        // on passe en argument le message d'erreur récupéré dans le paramètre error de la fonction lambda.
        this.olympics$.next(null);
        // accède à la propriété olympics$ de l'instance de la classe OlympicService et qui est un BehaviorSubject et on rend MAJ sa valeur en la rendant null pour indiquer aux abonnés qu’il n’y a plus de données disponibles en raison de l’erreur.
        return caught;
        // renvoie l'Observable original avec l’erreur, pr ainsi pouvoir le relancersi besoin.
      })

    );
  }

  //En résumé, loadInitialData() retourne l'Observable créé par http.get(). Par contre, à l'intérieur de cet Observable, on utilise le BehaviorSubject olympics$ pour stocker les données de manière centralisée et accessible à d'autres composants.

  getOlympics() {
  // mthd pr convertir le BehaviorSubject en un Observable disponible en lecture seule.
  // cela permet aux composants de s'y abonner SANS modifier les données.
    return this.olympics$.asObservable();
    // on accède à la propriété olympics$ de l'instance de la classe OlympicService
    // c'est un BehaviorSubject
    // La méthode asObservable() native de RxJS est utilisée pour créer un Observable
    // non modifiable (en lecture seule) à partir de ce BehaviorSubject
  }

  getOlympicByName(name: string): Olympic | undefined {
  // mthd pour récupérer une insatnce d'Olympic via le nom du pays
    const olympics = this.getOlympicsValue();
    // on récupère les données des JO stockées dans le BehaviorSubject (un tableau d'instances d'Olympic)
    // on les stocke dans une constante olympics

    if (!olympics) {
    // si la valeur d'olympics est "falsy" cad false, O,nul etc. alors on lance une erreur
      throw new Error('No olympics data available!');
    }

    const foundOlympic = olympics.find(olympic => olympic.country === name);
    // sinon on cherche dans le tableau
    // l'instance d'Olympic dont la valeur de la propriété country est égale
    // au nom passé en paramètre de la méthode

    if (!foundOlympic) {
    // s'il n'y a aucune instance trouvée, on lance une erreur
      throw new Error('Olympic not found!');
    }

    return foundOlympic;
    // sinon on retourne l'instance trouvée
  }

  countOlympics(): number {
  // méthode pr compter le nbr de pays participants aux JO
    const olympics = this.getOlympicsValue();
    // on récupère les données des JO stockées dans le BehaviorSubject (un tableau d'instances d'Olympic)
    // on les stocke dans une constante olympics

    return olympics ? olympics.length : 0;
    // opérateur ternaire : si olympics n'est pas null, on retourne la longueur du tableau, sinon on retourne 0
  }

  countParticipations(): number {
    const olympics = this.getOlympicsValue();
    // on récupère les données des JO stockées dans le BehaviorSubject (un tableau d'instances d'Olympic)
    // on les stocke dans une constante olympics

    return (olympics && olympics[0].participations) ? olympics[0].participations.length : 0;
    // opérateur ternaire : si le tableau d'insatnces n'est pas null et si le tableau des participations
    // de la première instance n'est pas null, on retourne sa longueur sinon on retourne 0
  }

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
    // reduce :un opérateur qui applique une fonction sur chaque élément du tableau qu'il parcourt (participations) pour réduire le tableau à une seule valeur.
    // sum : c'est l'accumulateur qui garde la somme des médailles au fur et à mesure de l'itération.
    // participation : une instance sur laquelle on itère dans le tableau participations.
    // 0 : valeur initiale de l'accumulateur sum, à partir de laquelle la somme commence.
    // la fonction lambda retourne la somme des valeurs de propriétés medalsCount de chaque objet participation dans le tableau particiaptions.
  }

  getTotalAthletes(olympic: Olympic): number {
  // mthd qui prend en argument une instance d'Olympic et qui retourne le nbr total d'athlètes
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
    // reduce :un opérateur qui applique une fonction sur chaque élément du tableau qu'il parcourt (participations)  pour réduire le tableau à une seule valeur.
    // sum : c'est l'accumulateur qui garde la somme des athletes au fur et à mesure de l'itération.
    // participation : une instance sur laquelle on itère dans le tableau participations.
    // 0 : valeur initiale de l'accumulateur sum, à partir de laquelle la somme commence.
    // la fonction lambda retourne la somme des valeurs de propriétés athleteCount de chaque objet participation dans le tableau particiaptions.

  }

  private getOlympicsValue(): Olympic[] {
  //je fais une mthd privée qui récupère la valeur actuelle stockée dans le BehaviorSubject SANS avoir besoin de s'abonner à l'Observable
    const olympics = this.olympics$.getValue();

    if (!olympics) {
      throw new Error('No olympics data available!');
    }
    return olympics;
  }

}
