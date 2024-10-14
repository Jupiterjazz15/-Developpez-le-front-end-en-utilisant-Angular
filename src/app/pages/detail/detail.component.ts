import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartComponent } from 'src/app/line-chart/line-chart.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  imports: [LineChartComponent,RouterLink],
  standalone: true,
})

export class DetailComponent implements OnInit {

  public olympic: Olympic | null = null;
  public countryName: string | null = null;
  public numberOfParticipations: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('country');
    console.log('Country parameter:', this.countryName);

    // Charger les données d'abord
    this.olympicService.loadInitialData().subscribe(() => {
      console.log('Data loaded');
      // Ensuite, essayer de récupérer les données spécifiques du pays
      if (this.countryName) {
        const olympicData = this.olympicService.getOlympicByName(this.countryName);
        console.log('Olympic data:', olympicData);

        if (olympicData) {
          this.olympic = olympicData;
          this.numberOfParticipations = olympicData.participations.length;
          this.totalMedals = this.olympicService.getTotalMedals(olympicData);
          this.totalAthletes = this.olympicService.getTotalAthletes(olympicData);
        } else {
          console.error('Country not found!');
          this.router.navigate(['**']);
        }
      } else {
        console.error(':(');
        this.router.navigate(['**']);
      }
    });
  }
}
