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

  loadInitialData() {
  // Méthode pour récupérer les données du fichier JSON et retourner un Observable
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics = value;
        this.olympics$.next(value);
        }),
      catchError((error, caught) => {
        alert('Erreur rencontrée' + error)
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
  // Méthode pour convertir le BehaviorSubject en un Observable disponible en lecture seule.
  // Cela permet aux composants de s'y abonner SANS modifier les données.
    return this.olympics$.asObservable();
  }

  countOlympics(): number {
    const olympics = this.getOlympicsValue();
    return olympics ? olympics.length : 0;
  }

  countParticipations(): number {
    const olympics = this.getOlympicsValue();
    return (olympics && olympics[0].participations) ? olympics[0].participations.length : 0;
  }

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

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
  }

  private getOlympicsValue(): Olympic[] {

    const olympics = this.olympics$.getValue();

    if (!olympics) {
      throw new Error('No olympics data available!');
    }
    return olympics;
  }

}
