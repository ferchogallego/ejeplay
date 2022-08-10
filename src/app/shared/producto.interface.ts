export interface Producto {
    id?: string;
    nombre: string;
    tipo: string;
    oferta: number;
    precio: number;
    cantPpal: number;
    cantSec: number;
    preciosec: number;
    categoria: string;
    peso: string;
    idioma: string;
    fechaCreacion: any;
    imageProd?: any;
    fileRef?: string;
    descripcion: string;
}
