import { Pipe, PipeTransform } from '@angular/core';

/**
 * Markdown minimo para las respuestas del asistente: titulos, negritas, cursivas,
 * codigo, listas y tablas. No se instala ninguna libreria para esto.
 *
 * <p>Devuelve texto plano y deja que [innerHTML] lo sanee: Angular permite
 * <table>/<strong> y descarta <script>, asi que un fallo de escape aqui no
 * convierte esto en un XSS.
 */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {

  transform(valor: string | null | undefined): string {
    return this.render(valor ?? '');
  }

  private render(texto: string): string {
    const lineas = texto.replace(/\r/g, '').split('\n');
    const salida: string[] = [];
    let lista = '';

    const cerrarLista = () => {
      if (lista) {
        salida.push(`</${lista}>`);
        lista = '';
      }
    };

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      const cruda = linea.trim();

      // Tabla: una fila con pipes y la siguiente es el separador |---|---|
      if (cruda.includes('|') && /^\|?[\s:|-]+\|[\s:|-]*$/.test(lineas[i + 1] ?? '')) {
        cerrarLista();
        const cabecera = this.celdas(cruda);
        i++;
        const cuerpo: string[][] = [];
        while (i + 1 < lineas.length && lineas[i + 1].trim().includes('|')) {
          cuerpo.push(this.celdas(lineas[++i]));
        }
        salida.push(
          '<table><thead><tr>' + cabecera.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
          cuerpo.map(fila => '<tr>' + fila.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') +
          '</tbody></table>'
        );
        continue;
      }

      if (!cruda) {
        cerrarLista();
        continue;
      }
      const vineta = cruda.match(/^[-*]\s+(.*)$/) || cruda.match(/^\d+\.\s+(.*)$/);
      if (vineta) {
        const tipo = /^\d/.test(cruda) ? 'ol' : 'ul';
        if (lista !== tipo) {
          cerrarLista();
          lista = tipo;
          salida.push(`<${tipo}>`);
        }
        salida.push(`<li>${this.enlineas(vineta[1])}</li>`);
        continue;
      }
      cerrarLista();

      const titulo = cruda.match(/^(#{1,4})\s+(.*)$/);
      if (titulo) {
        const nivel = Math.min(titulo[1].length + 2, 6);
        salida.push(`<h${nivel}>${this.enlineas(titulo[2])}</h${nivel}>`);
        continue;
      }
      salida.push(`<p>${this.enlineas(cruda)}</p>`);
    }
    cerrarLista();
    return salida.join('');
  }

  private celdas(fila: string): string[] {
    return fila.replace(/^\||\|$/g, '').split('|').map(c => this.enlineas(c.trim()));
  }

  /** Escapa primero y despues aplica el emphasis, para no abrir HTML del modelo. */
  private enlineas(texto: string): string {
    return this.escapar(texto)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  private escapar(texto: string): string {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
