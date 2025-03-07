import { assertEquals } from '@std/assert'
import { castFecha } from '../src/utils.ts'
import type { Formulario } from '../src/types.ts'

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

const sueldosBasicos = [{
  FECHA: castFecha('1/3/2024'),
  'CATEGORIA 1': 1054358,
  'CATEGORIA 2': 878633,
  'CATEGORIA 3': 731032,
  'CATEGORIA 4': 608023,
  'CATEGORIA 5': 506093,
  'CATEGORIA 6': 421738,
  'CATEGORIA 7': 351452,
}]

Deno.test('Cálculo de Permanencia de 2 a 4 años para la Categoria 3', () => {
  const t = main.calcularPermanencia(sueldosBasicos[0], 'CATEGORIA 3', '2 a 4 años')
  assertEquals(14760.1, t)
})

Deno.test('Cálculo de Adicional de grado para la Categoria 3', () => {
  const t = main.calcularAdicionalGrado(sueldosBasicos[0], 'CATEGORIA 3')
  assertEquals(58482.56, t)
})

Deno.test('Cálculo de Adicional de capacitacion para la Categoria 3', () => {
  const t = main.calcularAdicionalCapacitacion(sueldosBasicos[0], 'CATEGORIA 3')
  assertEquals(36551.6, t)
})

Deno.test('Cálculo de Adicional por titulo para la Categoria 3, TGU', () => {
  const t = main.calcularAdicionalTitulo(sueldosBasicos[0], 'CATEGORIA 3', 'TGU')
  assertEquals(146206.4, t)
})

Deno.test('Cálculo de Antiguedad para la Categoria 3, 3 años de antiguedad', () => {
  const t = main.calcularAntiguedad(sueldosBasicos[0], 'CATEGORIA 3', 3)
  assertEquals(43861.92, t)
})

Deno.test('Cálculo de Suplemento la Categoria 2 con base en la categoria 3', () => {
  const t = main.calcularSuplemento(formulario, sueldosBasicos[0])
  assertEquals(177121.2, t)
})

Deno.test('Cálculo de Suplemento cuando no hay un suplemento: da 0', () => {
  const t = main.calcularSuplemento({ ...formulario, suplementoCategoria: 'SIN SUPLEMENTO' }, sueldosBasicos[0])
  assertEquals(0, t)
})

Deno.test('Cálculo de Riesgo para la Categoria 3', () => {
  const t = main.calcularRiesgoFallo(sueldosBasicos[0], 'CATEGORIA 3', 'RIESGO')
  assertEquals(73103.2, t)
})

Deno.test('Cálculo de Fallo de caja para la Categoria 3', () => {
  const t = main.calcularRiesgoFallo(sueldosBasicos[0], 'CATEGORIA 3', 'FALLO')
  assertEquals(87863, t)
})

Deno.test('Cálculo de Fallo de caja para la Categoria 3, pero no hay riesgo ni fallo: da 0', () => {
  const t = main.calcularRiesgoFallo(sueldosBasicos[0], 'CATEGORIA 3', 'NO')
  assertEquals(0, t)
})

Deno.test('Cálculo el extra por hijos, con 2 hijos', () => {
  const t = main.calcularHijos(sueldosBasicos[0], 2)
  assertEquals(140580.8, t)
})

Deno.test('Cálculo el extra por hijos, con 0 hijos: da 0', () => {
  const t = main.calcularHijos(sueldosBasicos[0], 0)
  assertEquals(0, t)
})

Deno.test('Cálculo de Horas extra al 50%, con 5 horas', () => {
  const t = main.calcularHorasExtraCincuenta(sueldosBasicos[0]['CATEGORIA 3'], 5)
  assertEquals(39162.43, t)
})

Deno.test('Cálculo de Horas extra al 50%, con 0 horas: da 0', () => {
  const t = main.calcularHorasExtraCincuenta(sueldosBasicos[0]['CATEGORIA 3'], 0)
  assertEquals(0, t)
})

Deno.test('Cálculo de Horas extra al 100%, con 5 horas', () => {
  const t = main.calcularHorasExtraCien(sueldosBasicos[0]['CATEGORIA 3'], 5)
  assertEquals(52216.57, t)
})

Deno.test('Cálculo de Horas extra al 100%, con 0 horas: da 0', () => {
  const t = main.calcularHorasExtraCien(sueldosBasicos[0]['CATEGORIA 3'], 0)
  assertEquals(0, t)
})

Deno.test('Cálculo de Jubiliación', () => {
  const t = main.calcularJubilacion(sueldosBasicos[0]['CATEGORIA 3'])
  assertEquals(80413.52, t)
})

Deno.test('Cálculo de Ley19032', () => {
  const t = main.calcularLey19032(sueldosBasicos[0]['CATEGORIA 3'])
  assertEquals(21930.96, t)
})

Deno.test('Cálculo de OSUNSAM', () => {
  const t = main.calcularOsunsam(sueldosBasicos[0]['CATEGORIA 2'])
  assertEquals(26358.99, t)
})

Deno.test('Cálculo de APUNSAM para la categoría 3', () => {
  const t = main.calcularApunsam(sueldosBasicos[0], 'CATEGORIA 3', 'SI')
  assertEquals(10965.48, t)
})

Deno.test('Cálculo de APUNSAM para la categoría 3, sin APUNSAM: da 0', () => {
  const t = main.calcularApunsam(sueldosBasicos[0], 'CATEGORIA 3', 'NO')
  assertEquals(0, t)
})
