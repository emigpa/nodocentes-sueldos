import { assertEquals } from '@std/assert'
import { castFecha, createMonthsObject } from '../src/utils.ts'
import { castAdicionales } from '../src/data_parser.ts'
import type { Adicionales, Formulario } from '../src/types.ts'

import * as main from '../mod.ts'

const formulario = {
  categoria: 'CATEGORIA 3',
  antiguedad: 0,
  titulo: 'TGU',
  permanencia: '0 a 2 años',
  suplementoCategoria: 'CATEGORIA 2',
  apunsam: 'NO',
  horasExtraCincuenta: 0,
  horasExtraCien: 0,
  riesgofallo: 'NO',
  'añoCalcular': '2024',
  hijos: 0,
} as Formulario

const formularioHijos = {
  categoria: 'CATEGORIA 3',
  antiguedad: 0,
  titulo: 'TGU',
  permanencia: '0 a 2 años',
  suplementoCategoria: 'CATEGORIA 2',
  apunsam: 'NO',
  horasExtraCincuenta: 0,
  horasExtraCien: 0,
  riesgofallo: 'NO',
  'añoCalcular': '2024',
  hijos: 1,
} as Formulario

const sueldosBasicos = [
  {
    FECHA: castFecha('1/1/2024'),
    'CATEGORIA 1': 941390.44,
    'CATEGORIA 2': 784493.47,
    'CATEGORIA 3': 652706.41,
    'CATEGORIA 4': 542877.05,
    'CATEGORIA 5': 451868.38,
    'CATEGORIA 6': 376551.16,
    'CATEGORIA 7': 313795.81,
  },
  {
    FECHA: castFecha('1/2/2024'),
    'CATEGORIA 1': 1054358,
    'CATEGORIA 2': 878633,
    'CATEGORIA 3': 731032,
    'CATEGORIA 4': 608023,
    'CATEGORIA 5': 506093,
    'CATEGORIA 6': 421738,
    'CATEGORIA 7': 351452,
  },
]
const sueldosBasicosDataset = [
  {
    FECHA: '1/2/2024',
    'CATEGORIA 1': '941390.44',
    'CATEGORIA 2': '784493.47',
    'CATEGORIA 3': '652706.41',
    'CATEGORIA 4': '542877.05',
    'CATEGORIA 5': '451868.38',
    'CATEGORIA 6': '376551.16',
    'CATEGORIA 7': '313795.81',
  },
  {
    FECHA: '1/3/2024',
    'CATEGORIA 1': '1054358',
    'CATEGORIA 2': '878633',
    'CATEGORIA 3': '731032',
    'CATEGORIA 4': '608023',
    'CATEGORIA 5': '506093',
    'CATEGORIA 6': '421738',
    'CATEGORIA 7': '351452',
  },
]
const adicionalesDataset = [
  {
    DESDE: '02/01/2024',
    HASTA: '30/4/2024',
    CONCEPTO: 'suma fija',
    REMUNERATIVO: 'SI',
    'CATEGORIA 1': '0',
    'CATEGORIA 2': '100',
    'CATEGORIA 3': '200',
    'CATEGORIA 4': '0',
    'CATEGORIA 5': '0',
    'CATEGORIA 6': '0',
    'CATEGORIA 7': '0',
  },
]
const adicionales = [] as Adicionales[]
const meses = [createMonthsObject('1', '2024'), createMonthsObject('2', '2024')]
const mesEnero = [createMonthsObject('1', '2024')]

Deno.test('Cálculo de sueldo de Categoria 3', () => {
  const sueldo = main.calcularSueldoPorMes(
    formulario,
    meses,
    sueldosBasicos,
    adicionales,
  )
  assertEquals(1151009.23, sueldo[1].montoSueldoBruto)
})

Deno.test('Cálculo de porcentaje de aumento entre dos meses (12%)', () => {
  const sueldos = main.calcularSueldoPorMes(
    formularioHijos,
    meses,
    sueldosBasicos,
    [castAdicionales(adicionalesDataset[0])],
  )
  const conPorcentaje = main.calcularSueldosConPorcentajeAumento(sueldos)
  assertEquals(18.84, conPorcentaje[1].porcentajeAumento)
})

Deno.test('Cálculo de porcentaje de aumento del sueldo basico entre dos meses (12%)', () => {
  const sueldos = main.calcularSueldoPorMes(
    formularioHijos,
    meses,
    sueldosBasicos,
    [castAdicionales(adicionalesDataset[0])],
  )
  const conPorcentaje = main.calcularSueldosConPorcentajeAumento(sueldos)
  assertEquals(12, conPorcentaje[1].porcentajeAumentoBasico)
})

Deno.test('Cálculo de sueldo de Categoria 3 con porcentaje de aumento básico del 12%', () => {
  const sueldos = main.calcularSueldos(
    formulario,
    sueldosBasicosDataset,
    adicionalesDataset,
    { meses: ['2', '3'], año: '2024', ars: false },
  )
  assertEquals('1151109.23', sueldos[1].montoSueldoBruto)
  assertEquals('12', sueldos[1].porcentajeAumentoBasico)
})

Deno.test('Si es sueldo de Enero no cobra adicional por hijo', () => {
  const sueldo = main.calcularSueldoPorMes(
    formularioHijos,
    mesEnero,
    sueldosBasicos,
    adicionales,
  )
  assertEquals(0, sueldo[0].montoHijos)
})
