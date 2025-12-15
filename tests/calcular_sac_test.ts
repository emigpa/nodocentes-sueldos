import { parse } from '@std/csv/parse'
import { assertEquals } from '@std/assert'
import { castFecha, createMonthsObject } from '../src/utils.ts'
import { castAdicionales, castSueldosBasicos } from '../src/data_parser.ts'
import type { Adicionales, DatasetAdicionales, DatasetSueldosBasicos, Formulario, Meses } from '../src/types.ts'
import * as main from '../mod.ts'

const sueldosTSV = await Deno.readTextFile('./tests/sueldos_basicos.tsv')
const adicionalesTSV = await Deno.readTextFile('./tests/adicionales.tsv')

const formulario = {
  categoria: 'CATEGORIA 4',
  antiguedad: 7,
  titulo: 'TGU',
  permanencia: '2 a 4 años',
  suplementoCategoria: 'SIN SUPLEMENTO',
  apunsam: 'SI',
  horasExtraCincuenta: 0,
  horasExtraCien: 0,
  riesgofallo: 'NO',
  'añoCalcular': '2025',
  hijos: 1,
} as Formulario

const sueldosBasicosDataset = parse(sueldosTSV, {
  separator: '\t',
  skipFirstRow: true,
}) as unknown as DatasetSueldosBasicos[]

const adicionalesDataset = parse(adicionalesTSV, {
  separator: '\t',
  skipFirstRow: true,
}) as unknown as DatasetAdicionales[]

const sueldosBasicos = sueldosBasicosDataset.map((s) => castSueldosBasicos(s))

const adicionales = adicionalesDataset.map((a: DatasetAdicionales) => castAdicionales(a))

const meses = [] as Meses[]
for (let i = 1; i <= 12; i++) {
  meses.push(createMonthsObject(`${i}`, '2025'))
}

Deno.test('Cálculo de sueldo enero de 2025', () => {
  const sueldo = main.calcularSueldoPorMes(
    formulario,
    meses,
    sueldosBasicos,
    adicionales,
  )
  assertEquals(1436697.8, sueldo[0].montoSueldoBruto)
})

// Deno.test('Cálculo de porcentaje de aumento entre dos meses (12%)', () => {
//   const sueldos = main.calcularSueldoPorMes(
//     formularioHijos,
//     meses,
//     sueldosBasicos,
//     [castAdicionales(adicionalesDataset[0])],
//   )
//   const conPorcentaje = main.calcularSueldosConPorcentajeAumento(sueldos)
//   assertEquals(18.84, conPorcentaje[1].porcentajeAumento)
// })
//
// Deno.test('Cálculo de porcentaje de aumento del sueldo basico entre dos meses (12%)', () => {
//   const sueldos = main.calcularSueldoPorMes(
//     formularioHijos,
//     meses,
//     sueldosBasicos,
//     [castAdicionales(adicionalesDataset[0])],
//   )
//   const conPorcentaje = main.calcularSueldosConPorcentajeAumento(sueldos)
//   assertEquals(12, conPorcentaje[1].porcentajeAumentoBasico)
// })
//
// Deno.test('Cálculo de sueldo de Categoria 3 con porcentaje de aumento básico del 12%', () => {
//   const sueldos = main.calcularSueldos(
//     formulario,
//     sueldosBasicosDataset,
//     adicionalesDataset,
//     { meses: ['2', '3'], año: '2024', ars: false },
//   )
//   assertEquals('1151109.23', sueldos[1].montoSueldoBruto)
//   assertEquals('12', sueldos[1].porcentajeAumentoBasico)
// })
//
// Deno.test('Si es sueldo de Enero no cobra adicional por hijo', () => {
//   const sueldo = main.calcularSueldoPorMes(
//     formularioHijos,
//     mesEnero,
//     sueldosBasicos,
//     adicionales,
//   )
//   assertEquals(0, sueldo[0].montoHijos)
// })
