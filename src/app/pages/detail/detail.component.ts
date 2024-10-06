import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  countryName: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('DetailComponent initialized'); // Debug
    this.route.paramMap.subscribe(params => {
        this.countryName = this.route.snapshot.params['name'];
        if (this.countryName) {
            console.log('Country name:', this.countryName);
        } else {
            console.error('No country name found in parameters.'); // Debug
        }
    });
}

}
