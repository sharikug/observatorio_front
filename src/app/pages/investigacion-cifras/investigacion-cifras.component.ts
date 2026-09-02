import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investigacion-cifras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investigacion-cifras.component.html',
  styleUrl: './investigacion-cifras.component.scss'
})
export class InvestigacionCifrasComponent {
  charts = [
    { image: 'assets/images/chart-1.svg' },
    { image: 'assets/images/chart-2.svg' },
    { image: 'assets/images/chart-3.svg' }
  ];
}
