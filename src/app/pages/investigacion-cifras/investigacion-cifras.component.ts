import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-investigacion-cifras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './investigacion-cifras.component.html',
  styleUrl: './investigacion-cifras.component.scss'
})
export class InvestigacionCifrasComponent {}
