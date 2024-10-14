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
  public participationsCount: number = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympicService.loadInitialData().subscribe(() => {
      this.olympicsCount = this.olympicService.countOlympics();
      this.participationsCount = this.olympicService.countParticipations();
    });
  }
}
