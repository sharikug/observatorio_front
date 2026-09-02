import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-impacto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-impacto.component.html',
  styleUrl: './detalle-impacto.component.scss'
})
export class DetalleImpactoComponent implements OnInit {
  impactCase: any;
  allCases = [
    { id: 1, title: 'Innovaciones en gestion hospitalaria', desc: 'Proyectos de alto impacto en areas del conocimiento.', image: 'assets/images/detalle-impacto.svg', researchers: [{name:'Mario Pelaez', role:'Ing Industrial'},{name:'Milton Guanaco', role:'Medico General'},{name:'Maria Milena', role:'Medica Cirujana'}], links: ['www.grupoinvestigacion.com','www.innovacionhospitalaria.com'] },
    { id: 2, title: 'Recuperacion de suelos agricolas', desc: 'Metodologias para recuperacion de suelos por exceso de mal uso.', image: 'assets/images/detalle-impacto.svg', researchers: [{name:'Mario Pelaez', role:'Ing Industrial'}], links: ['www.grupoinvestigacion.com'] },
    { id: 3, title: 'Innovacion en energias renovables', desc: 'Desarrollo de soluciones sostenibles.', image: 'assets/images/detalle-impacto.svg', researchers: [{name:'Milton Guanaco', role:'Medico General'}], links: [] }
  ];
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.impactCase = this.allCases.find(c => c.id === id) || this.allCases[0];
  }
}
