import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUser } from '../../components/navbar-user/navbar-user';
import { TipoFuente } from '../../services/models/modelos';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // <-- Agrega esto
import { Api } from '../../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarUser, RouterModule, FormsModule, HttpClientModule, CommonModule, NgxChartsModule], // <-- Agrega HttpClientModule aquí
  providers: [Api, Router],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  recursos: TipoFuente[] = [
  { id: 1, nombre: "Electricidad CFE", unidad: "kWh" },
  { id: 2, nombre: "Gasolina Magna/Diesel", unidad: "litro" },
  { id: 4, nombre: "Gas Natural", unidad: "m³" },
  { id: 5, nombre: "GLP", unidad: "kg" },
  { id: 6, nombre: "Residuos Sólidos", unidad: "kg" },
  { id: 7, nombre: "Transporte Aéreo", unidad: "km" },
  { id: 8, nombre: "Agua Potable", unidad: "litros" },
  ];
      // Declara las propiedades necesarias
  user: number = 0;
  mes: number = 0;
  año: number = 0;

  actividades: any[] = []
  resume:any[]=[]

  nuevaActividad:any={}
  
  huella:number = 0
  historial:any
  prediccion:number = 0
  trend:string = ''

customColorScheme: any = {
  domain: [
    '#F7FFE3', // color-back
    '#82BCCA', // color-blue
    '#77A645', // color-green
    '#074F34', // color-dark-green
  ],
  name: 'customScheme',
  selectable: true,
  group: 'Ordinal'
};


    // RouterModule no se inyecta, solo Router
    constructor(private router: Router, private api: Api) { }

    ngOnInit(){
      this.actualizarDatos()
      this.obtenerHuella()
      this.obtenerHistorial()
      this.obtenerPrediccion()
    }

    actualizarDatos(){
      this.obtenerFecha();
      const userStorage = sessionStorage.getItem('user');
      this.user = userStorage ? Number(userStorage) : 0;
      
      this.api.obtenerActividades(this.user, this.mes, this.año).subscribe({
        next: (data:any) => {
          this.actividades = data.data
          this.resume = data.resume
          this.mergeResumeIntoRecursos();
        },
        error: (error) =>{
          console.error(error.message);
        }
      })
    }

    obtenerFecha() {
      const fecha = new Date();
      this.mes = fecha.getMonth() + 1;  // Asigna a la propiedad de clase
      this.año = fecha.getFullYear();   // Asigna a la propiedad de clase
    }

    eliminarActividad(id:number){
      this.api.eliminarActividad(id).subscribe({
        next: (data:any) => {
          console.log(data);
          this.actualizarDatos(); // Actualiza los datos después de eliminar
        },
        error: (error) =>{
          console.error(error);
        }
      })
    }

    mergeResumeIntoRecursos() {
    this.recursos.forEach(recurso => {
      const match = this.resume.find(r => r.nombre_fuente === recurso.nombre);
      if (match) {
        recurso.total_cantidad = match.total_cantidad;
        recurso.total_costo = match.total_costo;
      } else {
        recurso.total_cantidad = 0;
        recurso.total_costo = 0;
      }
    });
    this.formatearDatosGastoParaPie()
  }

  guardarNuevaActividad(){
    this.nuevaActividad.id_tipo_fuente = Number(this.nuevaActividad.id_tipo_fuente);
    console.log(this.nuevaActividad);
    this.api.agregarActividad(this.user, this.nuevaActividad).subscribe({
      next:(data)=>{
        alert("Actividad registrada correctamente")
        this.actualizarDatos();
      },
      error:(error)=>{
        console.error(error)
      }

    })
  }

  obtenerHuella(){
    const detalles = {
      id_usuario: this.user,
      mes_periodo: this.mes,
      año_periodo:this.año
    }
    this.api.crearHuella(detalles).subscribe({
      next:(data:any)=>{
        this.huella = data.total_huella
        this.actualizarComparativaHuellaPrediccion();
      },
      error:(error)=>{
        console.error(error)
      }
    })
  }

  obtenerHistorial(){
    this.api.obtenerHistorial(this.user).subscribe({
      next:(data:any)=>{
        this.historial = data.huella
        console.log(this.historial);
        this.formatearHistorialParaGrafica();
      },
      error:(error)=>{
        console.error(error)
      }
    })
  }

  obtenerPrediccion(){
    this.api.obtenerPrediccion(this.user).subscribe({
      next:(data:any)=>{
        this.prediccion = data.data.prediction
        this.trend = data.data.trend;
        this.actualizarComparativaHuellaPrediccion();
      },
      error:(error)=>{
        console.error(error)
      }
    })
  }

  //graficas
  datosGrafica:any
  formatearHistorialParaGrafica() {
    const añoFiltrado = 2025; // o puedes usar: new Date().getFullYear()
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    this.datosGrafica = this.historial
      .filter((h: any) => h.año_periodo === añoFiltrado)
      .sort((a: any, b: any) => a.mes_periodo - b.mes_periodo)
      .map((h: any) => ({
        name: meses[h.mes_periodo - 1],
        value: h.total
      }));
  }

  datosComparativa:any
  actualizarComparativaHuellaPrediccion() {
  this.datosComparativa = [
    {
      name: 'Actual',
      value: this.huella
    },
    {
      name: 'Predicción',
      value: this.prediccion
    }
  ];
  }

  datosGasto:any
  formatearDatosGastoParaPie() {
  this.datosGasto = this.recursos.map(item => ({
    name: item.nombre,
    value: item.total_costo
  }));
}

  //generarPDF
  generarReportePDF() {
    const doc = new jsPDF();
    
    // Configuración inicial
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    let yPosition = 20;

    // --- COLORES DE LA MARCA (como arrays de 3 números) ---
    const colors = {
      darkGreen: [7, 79, 52] as [number, number, number],    // #074F34
      green: [119, 166, 69] as [number, number, number],     // #77A645
      blue: [130, 188, 202] as [number, number, number],     // #82BCCA
      lightBackground: [247, 255, 227] as [number, number, number], // #F7FFE3
      gray: [217, 217, 217] as [number, number, number],     // #D9D9D9
      darkGray: [185, 185, 185] as [number, number, number]  // #B9B9B9
    };

    // --- ESTILOS ---
    const styles = {
      title: { size: 20, style: 'bold' as const, color: colors.darkGreen },
      subtitle: { size: 16, style: 'bold' as const, color: colors.darkGreen },
      normal: { size: 12, color: [0, 0, 0] as [number, number, number] },
      small: { size: 10, color: [100, 100, 100] as [number, number, number] }
    };

    // --- FONDO DEGRADADO SUAVE ---
    doc.setFillColor(colors.lightBackground[0], colors.lightBackground[1], colors.lightBackground[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // --- LOGO/ENCABEZADO ---
    doc.setFontSize(styles.title.size);
    doc.setFont( styles.title.style);
    doc.setTextColor(styles.title.color[0], styles.title.color[1], styles.title.color[2]);
    doc.text('REPORTE DE HUELLA DE CARBONO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    doc.setFontSize(styles.small.size);
    doc.setFont( 'normal');
    doc.setTextColor(styles.small.color[0], styles.small.color[1], styles.small.color[2]);
    doc.text('Comprometidos con la sostenibilidad ambiental', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // --- INFORMACIÓN GENERAL ---
    doc.setFontSize(styles.normal.size);
    doc.setTextColor(styles.normal.color[0], styles.normal.color[1], styles.normal.color[2]);
    doc.text(`Fecha del reporte: ${new Date().toLocaleDateString('es-MX')}`, margin, yPosition);
    yPosition += 15;

    // --- TARJETA DE RESUMEN PRINCIPAL ---
    this.drawCard(doc, margin, yPosition, pageWidth - margin * 2, 40, colors.green);
    
    doc.setFontSize(styles.subtitle.size);
    doc.setFont( styles.subtitle.style);
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text('RESUMEN DE HUELLA DE CARBONO', margin + 10, yPosition + 15);
    
    doc.setFontSize(styles.normal.size);
    doc.setFont( 'normal');
    doc.text(`Huella actual: ${this.huella.toFixed(2)} kg CO₂`, margin + 10, yPosition + 25);
    doc.text(`Predicción: ${this.prediccion.toFixed(2)} kg CO₂`, margin + 10, yPosition + 32);
    

    yPosition += 50;

    // --- TABLA DE ACTIVIDADES ---
    doc.setFontSize(styles.subtitle.size);
    doc.setFont( styles.subtitle.style);
    doc.setTextColor(styles.subtitle.color[0], styles.subtitle.color[1], styles.subtitle.color[2]);
    doc.text('DETALLE POR TIPO DE RECURSO', margin, yPosition);
    yPosition += 10;

    // Preparar datos para la tabla
    const tableData = this.recursos.map(recurso => [
      recurso.nombre,
      recurso.total_cantidad ? recurso.total_cantidad.toFixed(2) : '0.00',
      recurso.unidad,
      recurso.total_costo ? `$${recurso.total_costo.toFixed(2)}` : '$0.00'
    ]);

    // Generar tabla con colores de la marca - FORMA CORRECTA para autoTable
    autoTable(doc, {
      head: [['Recurso', 'Cantidad', 'Unidad', 'Costo']],
      body: tableData,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: 'linebreak' as const,
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: colors.darkGreen as any, // Usar 'as any' para evitar problemas de tipos
        textColor: 255,
        fontStyle: 'bold' as const,
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: colors.lightBackground as any
      },
      bodyStyles: {
        fillColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' as const },
        1: { cellWidth: 35, halign: 'right' as const },
        2: { cellWidth: 30, halign: 'center' as const },
        3: { cellWidth: 35, halign: 'right' as const }
      }
    });

    // Obtener posición después de la tabla
    const finalY = (doc as any).lastAutoTable?.finalY;
    yPosition = finalY ? finalY + 15 : yPosition + 100;

    // --- HISTORIAL (si hay espacio) ---
    if (yPosition < 220 && this.historial && this.historial.length > 0) {
      this.drawCard(doc, margin, yPosition, pageWidth - margin * 2, 30, colors.blue);
      
      doc.setFontSize(styles.subtitle.size);
      doc.setFont( styles.subtitle.style);
      doc.setTextColor(255, 255, 255);
      doc.text('HISTORIAL RECIENTE', margin + 10, yPosition + 12);
      yPosition += 25;

      const historialData = this.historial.slice(0, 4).map((item: any) => [
        `${item.mes_periodo}/${item.año_periodo}`,
        `${item.total_huella.toFixed(2)} kg CO₂`
      ]);

      autoTable(doc, {
        head: [['Periodo', 'Huella']],
        body: historialData,
        startY: yPosition,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: colors.blue as any,
          textColor: 255,
          fontStyle: 'bold' as const
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        columnStyles: {
          0: { cellWidth: 40, halign: 'center' as const },
          1: { cellWidth: 50, halign: 'right' as const }
        }
      });

      const finalY2 = (doc as any).lastAutoTable?.finalY;
      yPosition = finalY2 ? finalY2 + 10 : yPosition + 50;
    }

    // --- PIE DE PÁGINA ---
    doc.setFillColor(colors.darkGreen[0], colors.darkGreen[1], colors.darkGreen[2]);
    doc.rect(0, doc.internal.pageSize.height - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(styles.small.size);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Reporte generado el ${new Date().toLocaleDateString('es-MX')} - Página 1 de 1`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );

    // Guardar el PDF
    const fileName = `huella_carbono_${this.user}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  // --- FUNCIÓN AUXILIAR PARA DIBUJAR TARJETAS ---
  drawCard(doc: any, x: number, y: number, width: number, height: number, color: [number, number, number]) {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x, y, width, height, 3, 3, 'F');
    
    // Borde sutil
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');
  }
}
