import { parse } from '@std/csv/parse'
import { assertEquals } from '@std/assert'
import { createMonthsObject } from '../src/utils.ts'
import { castAdicionales, castSueldosBasicos } from '../src/data_parser.ts'
import type { DatasetAdicionales, DatasetSueldosBasicos, Formulario, Meses } from '../src/types.ts'
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

Deno.test('Cálculo de segundo SAC 2025', () => {
  const sac = main.calcularSac(
    formulario,
    sueldosBasicosDataset,
    adicionalesDataset,
    { meses: ['7', '8', '9', '10', '11', '12'], año: '2025', ars: false },
  )
  assertEquals(666459.77, sac.montoNeto)
})
