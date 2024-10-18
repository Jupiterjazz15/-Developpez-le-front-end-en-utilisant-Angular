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
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
    // pipe(take(1)) => l'opérateur pipe de RxJS transforme un Observable en un nouvel Observable
    // ici on utilise l'opérateur take(1) pour n'exécuter la requête qu'une seule fois
    // subscribe() => méthode qui démarre l'écoute de l'Observable, dont on n'écoutera que la première valeur émise
  }
}
