import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) {
    console.log('AppComponent initialized');
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
    // pipe(take(1)) => utilisation de l'opérateur pipe de RxJS pr transformer un Observable en un nouvel Observable
    // ici on utilise l'opérateur take(1) pour n'exécuter la requête qu'une seule fois
    // subscribe() => méthode qui démarre l'écoute de l'Observable. Dont on n'écoutera que la première valeur émise
  }
}
