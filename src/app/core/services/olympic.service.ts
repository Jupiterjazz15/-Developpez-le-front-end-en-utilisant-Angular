import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private olympics: Olympic[] | null = null;

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données du fichier JSON et retourner un Observable
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics = value;
        this.olympics$.next(value);
        }),
      catchError((error, caught) => {
        alert('Error encountered' + error)
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  // Méthode pour convertir le BehaviorSubject en un Observable disponible en lecture seule.
  // Cela permet aux composants de s'y abonner SANS modifier les données.
  getOlympics() {
    return this.olympics$.asObservable();
  }

  // Méthode pour compter le nombre de pays participants aux JO
  countOlympics(): number {
    const olympics = this.getOlympicsValue();
    return olympics ? olympics.length : 0;
  }

  // Méthode pour compter le nombre de fois où un pays a participé aux JO
  countParticipations(): number {
    const olympics = this.getOlympicsValue();
    return (olympics && olympics[0].participations) ? olympics[0].participations.length : 0;
  }

  // Méthode pour trouver l'instance Olympic correspondant à un pays donné
  getOlympicByName(name: string): Olympic | undefined {
    const olympics = this.getOlympicsValue();

    if (!olympics) {
      throw new Error('No olympics data available!');
    }

    const foundOlympic = olympics.find(olympic => olympic.country === name);

    if (!foundOlympic) {
      throw new Error('Olympic not found!');
    }

    return foundOlympic;
  }

  // Méthode pour avoir le nombre total de médailles remportées par un pays
  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  // Méthode pour avoir le nombre total d'athlètes par pays
  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
  }

  // Méthode pour récupérer la valeur du BehaviorSubject et retourner un tableau d'objets Olympic
  private getOlympicsValue(): Olympic[] {

    const olympics = this.olympics$.getValue();

    if (!olympics) {
      throw new Error('No olympics data available!');
    }
    return olympics;
  }

}
