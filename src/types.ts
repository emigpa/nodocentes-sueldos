import type { DateTime } from 'luxon'

export enum AdicionalGradoRatio {
  'CATEGORIA 1' = 0.06,
  'CATEGORIA 2' = 0.07,
  'CATEGORIA 3' = 0.08,
  'CATEGORIA 4' = 0.11,
  'CATEGORIA 5' = 0.14,
  'CATEGORIA 6' = 0.23,
  'CATEGORIA 7' = 0.27,
}
export enum AdicionalCapacitacionRatio {
  'CATEGORIA 1' = 0.03,
  'CATEGORIA 2' = 0.04,
  'CATEGORIA 3' = 0.05,
  'CATEGORIA 4' = 0.06,
  'CATEGORIA 5' = 0.07,
  'CATEGORIA 6' = 0.08,
  'CATEGORIA 7' = 0.1,
}
export enum AdicionalTituloRatio {
  'Primario' = 0,
  'Secundario' = 0.175,
  'Terciario' = 0.1,
  'TGU' = 0.2,
  'Universitario' = 0.25,
  'Posgrado' = 0.3,
}
export enum AntiguedadPermanenciaRatio {
  base = 0.37,
  '0 a 2 años' = 0,
  '2 a 4 años' = 0.1,
  '4 a 6 años' = 0.25,
  '6 a 8 años' = 0.45,
  'más de 8 años' = 0.7,
}

export enum RiesgoFalloRatio {
  'NO' = 0,
  'RIESGO' = 0.100,
  'FALLO' = 0.250,
}

export enum HorasExtraRatio {
  'CINCUENTA' = 1.5,
  'CIEN' = 2,
}

export enum JubilacionRatio {
  'JUBILACION' = 0.11,
  'LEY19032' = 0.03,
  'OSUNSAM' = 0.03,
  'APUNSAM' = 0.015,
}
export enum HijosRatio {
  'ratio' = 0.20,
}

export type Sueldo = number

export type Formulario = {
  categoria: Categoria
  antiguedad: number
  titulo: Titulo
  permanencia: Permanencia
  suplementoCategoria: CategoriaSuplemento
  apunsam: Apunsam
  horasExtraCincuenta: number
  horasExtraCien: number
  hijos: number
  riesgofallo: RiesgoFallo
  añoCalcular: string
}

export type Calculos = {
  mes: DateTime
  adicionales: Adicional[]
  montoSueldoBasico: Sueldo
  montoSueldoSuplemento: Sueldo
  montoPermanencia: Sueldo
  montoAdicionalGrado: Sueldo
  montoAdicionalCapacitacion: Sueldo
  montoAdicionalTitulo: Sueldo
  montoAntiguedad: Sueldo
  montoRiesgoFallo: Sueldo
  montoHorasExtraCincuenta: Sueldo
  montoHorasExtraCien: Sueldo
  montoJubilacion: Sueldo
  montoLey19032: Sueldo
  montoOsunsam: Sueldo
  montoApunsam: Sueldo
  montoHijos: Sueldo
  montoTotalDescuentos: Sueldo
  montoSueldoNeto: Sueldo
  montoSueldoBruto: Sueldo
  porcentajeAumento?: Sueldo
  porcentajeAumentoBasico?: Sueldo
}

export type CalculosResult = {
  mes: string
  adicionales: AdicionalResult[]
  montoSueldoBasico: string
  montoSueldoSuplemento: string
  montoPermanencia: string
  montoAdicionalGrado: string
  montoAdicionalCapacitacion: string
  montoAdicionalTitulo: string
  montoAntiguedad: string
  montoRiesgoFallo: string
  montoHorasExtraCincuenta: string
  montoHorasExtraCien: string
  montoJubilacion: string
  montoLey19032: string
  montoOsunsam: string
  montoApunsam: string
  montoHijos: string
  montoTotalDescuentos: string
  montoSueldoNeto: string
  montoSueldoBruto: string
  porcentajeAumento: string
  porcentajeAumentoBasico: string
}

export type Categoria =
  | 'CATEGORIA 1'
  | 'CATEGORIA 2'
  | 'CATEGORIA 3'
  | 'CATEGORIA 4'
  | 'CATEGORIA 5'
  | 'CATEGORIA 6'
  | 'CATEGORIA 7'

export type CategoriaSuplemento =
  | 'CATEGORIA 1'
  | 'CATEGORIA 2'
  | 'CATEGORIA 3'
  | 'CATEGORIA 4'
  | 'CATEGORIA 5'
  | 'CATEGORIA 6'
  | 'SIN SUPLEMENTO'

export type Titulo =
  | 'Primario'
  | 'Secundario'
  | 'Terciario'
  | 'TGU'
  | 'Universitario'
  | 'Posgrado'

export type Permanencia =
  | '0 a 2 años'
  | '2 a 4 años'
  | '4 a 6 años'
  | '6 a 8 años'
  | 'más de 8 años'

export type RiesgoFallo =
  | 'NO'
  | 'RIESGO'
  | 'FALLO'

export type Apunsam =
  | 'SI'
  | 'NO'

export type HorasExtra =
  | 'CIEN'
  | 'CINCUENTA'

export type DatasetSueldosBasicos = {
  'FECHA': string
  'CATEGORIA 1': string
  'CATEGORIA 2': string
  'CATEGORIA 3': string
  'CATEGORIA 4': string
  'CATEGORIA 5': string
  'CATEGORIA 6': string
  'CATEGORIA 7': string
}

export type SueldosBasicos = {
  'FECHA': DateTime
  'CATEGORIA 1': Sueldo
  'CATEGORIA 2': Sueldo
  'CATEGORIA 3': Sueldo
  'CATEGORIA 4': Sueldo
  'CATEGORIA 5': Sueldo
  'CATEGORIA 6': Sueldo
  'CATEGORIA 7': Sueldo
}
export type SueldosBasicosConDesdeHasta = {
  'FECHA': DateTime
  'DESDE': DateTime
  'HASTA': DateTime
  'CATEGORIA 1': Sueldo
  'CATEGORIA 2': Sueldo
  'CATEGORIA 3': Sueldo
  'CATEGORIA 4': Sueldo
  'CATEGORIA 5': Sueldo
  'CATEGORIA 6': Sueldo
  'CATEGORIA 7': Sueldo
}

export type Remunerativo =
  | 'SI'
  | 'NO'

export type DatasetAdicionales = {
  DESDE: string
  HASTA: string
  CONCEPTO: string
  REMUNERATIVO: string
  'CATEGORIA 1': string
  'CATEGORIA 2': string
  'CATEGORIA 3': string
  'CATEGORIA 4': string
  'CATEGORIA 5': string
  'CATEGORIA 6': string
  'CATEGORIA 7': string
}

export type Adicionales = {
  DESDE: DateTime
  HASTA: DateTime
  CONCEPTO: string
  REMUNERATIVO: Remunerativo
  'CATEGORIA 1': Sueldo
  'CATEGORIA 2': Sueldo
  'CATEGORIA 3': Sueldo
  'CATEGORIA 4': Sueldo
  'CATEGORIA 5': Sueldo
  'CATEGORIA 6': Sueldo
  'CATEGORIA 7': Sueldo
}

export type Meses = {
  DESDE: DateTime
  HASTA: DateTime
}

export type Adicional = {
  monto: Sueldo
  concepto: string
  remunerativo: boolean
}
export type AdicionalResult = {
  monto: string
  concepto: string
  remunerativo: string
}
