import type {
  Adicionales,
  Calculos,
  CalculosResult,
  CalculosSac,
  DatasetAdicionales,
  DatasetSueldosBasicos,
  Formulario,
  Meses,
  SueldosBasicos,
} from './types.ts'
import { JubilacionRatio } from './types.ts'
import { calcularPorcentaje, roundUp, sumSueldos } from './utils.ts'
import {
  castAdicionales,
  castSueldosBasicos,
  filterAdicionalesPorFecha,
  findSueldosBasicosPorFecha,
  sueldosBasicosOnTimeline,
} from './data_parser.ts'
import * as calculosParciales from './calculos_parciales.ts'
import { createMonthsObject } from './utils.ts'
import { parseResults } from './data_parser.ts'

/**
 * Calculates the monthly salary based on the provided inputs.
 *
 * @param formulario - The form data.
 * @param meses - The months for which the salary needs to be calculated.
 * @param sueldosBasicos - The basic salaries for different categories.
 * @param adicionales - The additional salary components.
 * @returns An array of calculations for each month, including the salary details.
 */
export function calcularSueldoPorMes(
  formulario: Formulario,
  meses: Meses[],
  sueldosBasicos: SueldosBasicos[],
  adicionales: Adicionales[],
): Calculos[] {
  const mesesConBasicosYAdicionales = meses
    .map((m) => {
      const mes = m.DESDE
      const sueldosBasicosFiltrados = findSueldosBasicosPorFecha(
        sueldosBasicosOnTimeline(sueldosBasicos),
        m.DESDE,
        m.HASTA,
      )
      const adicionalesFiltradosPorFecha = filterAdicionalesPorFecha(adicionales, m.DESDE, m.HASTA)
      return {
        mes,
        sueldosBasicos: sueldosBasicosFiltrados,
        adicionales: adicionalesFiltradosPorFecha,
      }
    })

  return mesesConBasicosYAdicionales
    .map((m) => {
      const categoriaRevista = formulario.suplementoCategoria === 'SIN SUPLEMENTO'
        ? formulario.categoria
        : formulario.suplementoCategoria

      const montoSueldoBasico = m.sueldosBasicos[formulario.categoria]

      const montoAntiguedad = calculosParciales.calcularAntiguedad(
        m.sueldosBasicos,
        formulario.categoria,
        formulario.antiguedad,
      )

      const montoPermanencia = calculosParciales.calcularPermanencia(
        m.sueldosBasicos,
        categoriaRevista,
        formulario.permanencia,
      )

      const montoAdicionalTitulo = calculosParciales.calcularAdicionalTitulo(
        m.sueldosBasicos,
        formulario.categoria,
        formulario.titulo,
      )

      const montoRiesgoFallo = calculosParciales.calcularRiesgoFallo(
        m.sueldosBasicos,
        formulario.categoria,
        formulario.riesgofallo,
      )

      const montoAdicionalGrado = calculosParciales.calcularAdicionalGrado(
        m.sueldosBasicos,
        categoriaRevista,
      )

      const montoAdicionalCapacitacion = calculosParciales.calcularAdicionalCapacitacion(
        m.sueldosBasicos,
        categoriaRevista,
      )

      // Si el mes es enero, no cobra el adicional por hijo.
      const montoHijos = m.mes.get('month') === 1
        ? 0
        : calculosParciales.calcularHijos(m.sueldosBasicos, formulario.hijos)

      const adicionalesNoRemunerativos = sumSueldos(
        m.adicionales
          .filter((a: Adicionales) => a.REMUNERATIVO === 'NO')
          .map((a: Adicionales) => a[categoriaRevista]),
      )

      const adicionalesRemunerativos = sumSueldos(
        m.adicionales
          .filter((a) => a.REMUNERATIVO === 'SI')
          .map((a) => a[categoriaRevista]),
      )

      const montoSueldoSuplemento = calculosParciales.calcularSuplemento(
        formulario,
        m.sueldosBasicos,
      )

      const montoBrutoSinHrsExtra = sumSueldos([
        montoSueldoBasico,
        montoSueldoSuplemento,
        montoAntiguedad,
        montoAdicionalTitulo,
        montoRiesgoFallo,
        montoPermanencia,
        montoAdicionalGrado,
        montoAdicionalCapacitacion,
        adicionalesRemunerativos,
        adicionalesNoRemunerativos,
      ])

      const montoHorasExtraCincuenta = calculosParciales.calcularHorasExtraCincuenta(
        montoBrutoSinHrsExtra,
        formulario.horasExtraCincuenta,
      )

      const montoHorasExtraCien = calculosParciales.calcularHorasExtraCien(
        montoBrutoSinHrsExtra,
        formulario.horasExtraCien,
      )

      const montosRemunerativos = sumSueldos([
        montoSueldoBasico,
        montoSueldoSuplemento,
        montoAntiguedad,
        montoAdicionalTitulo,
        montoRiesgoFallo,
        montoPermanencia,
        montoAdicionalGrado,
        montoAdicionalCapacitacion,
        adicionalesRemunerativos,
        montoHorasExtraCincuenta,
        montoHorasExtraCien,
      ])

      const montosNoRemunerativos = sumSueldos([
        adicionalesNoRemunerativos,
        montoHijos,
      ])

      const montoJubilacion = calculosParciales.calcularJubilacion(montosRemunerativos)

      const montoLey19032 = calculosParciales.calcularLey19032(montosRemunerativos)

      const montoOsunsam = calculosParciales.calcularOsunsam(montosRemunerativos)

      const montoApunsam = calculosParciales.calcularApunsam(
        m.sueldosBasicos,
        formulario.categoria,
        formulario.apunsam,
      )

      const montoTotalDescuentos = sumSueldos([
        montoJubilacion,
        montoLey19032,
        montoOsunsam,
        montoApunsam,
      ])

      const montoSueldoBruto = sumSueldos([
        montosRemunerativos,
        montosNoRemunerativos,
      ])

      const montoSueldoNeto = roundUp(montoSueldoBruto - montoTotalDescuentos)

      const adicionalesDetalle = m.adicionales
        .map((a) => ({
          monto: a[categoriaRevista],
          concepto: a.CONCEPTO,
          remunerativo: a.REMUNERATIVO === 'SI',
        }))
        .filter((a) => a.monto > 0)

      return {
        mes: m.mes,
        adicionales: adicionalesDetalle,
        montoSueldoBasico,
        montoSueldoSuplemento,
        montoPermanencia,
        montoAdicionalGrado,
        montoAdicionalCapacitacion,
        montoAdicionalTitulo,
        montoAntiguedad,
        montoRiesgoFallo,
        montoHorasExtraCincuenta,
        montoHorasExtraCien,
        montoJubilacion,
        montoLey19032,
        montoOsunsam,
        montoApunsam,
        montoHijos,
        montoTotalDescuentos,
        montoSueldoNeto,
        montoSueldoBruto,
        montosRemunerativos,
        montosNoRemunerativos,
      }
    })
}

/**
 * Calculates the salaries with percentage increase.
 * @param sueldosPorMes - The array of salary calculations.
 * @returns The array of salary calculations with added percentage increase.
 */
export function calcularSueldosConPorcentajeAumento(sueldosPorMes: Calculos[]): Calculos[] {
  return sueldosPorMes
    .map((s, i, a) => {
      if (i === 0) {
        return {
          ...s,
          porcentajeAumento: 0,
          porcentajeAumentoBasico: 0,
        }
      } else {
        const montoSueldoAnterior = a[i - 1].montoSueldoBruto
        const montoSueldoActual = s.montoSueldoBruto
        const porcentajeAumento = calcularPorcentaje(
          montoSueldoAnterior,
          montoSueldoActual,
        )
        const montoSueldoBasicoAnterior = a[i - 1].montoSueldoBasico
        const montoSueldoBasicoActual = s.montoSueldoBasico
        const porcentajeAumentoBasico = calcularPorcentaje(
          montoSueldoBasicoAnterior,
          montoSueldoBasicoActual,
        )
        return {
          ...s,
          porcentajeAumento,
          porcentajeAumentoBasico,
        }
      }
    })
}

interface calcularSueldosOptions {
  meses: string[]
  año: string
  ars?: boolean
}

/**
 * Calculates the salaries based on the provided inputs.
 *
 * @param formulario - The form data.
 * @param sueldosBasicos - The dataset of basic salaries.
 * @param adicionales - The dataset of additional salaries.
 * @param options - The calculation options: { meses(1-12): string[], año(YYYY): string }.
 * @returns An array of calculated salaries.
 */
export function calcularSueldos(
  formulario: Formulario,
  sueldosBasicos: DatasetSueldosBasicos[],
  adicionales: DatasetAdicionales[],
  options: calcularSueldosOptions,
): CalculosResult[] {
  const createMonths = options.meses.map((m) => createMonthsObject(m, options.año))
  const sueldosBasicosCast = sueldosBasicos.map((sb) => castSueldosBasicos(sb, options.ars))
  const adicionalesCast = adicionales.map((a) => castAdicionales(a, options.ars))
  const sueldosPorMes = calcularSueldoPorMes(formulario, createMonths, sueldosBasicosCast, adicionalesCast)
  const sueldosConPorcentajeAumento = calcularSueldosConPorcentajeAumento(sueldosPorMes)
  const result = parseResults(sueldosConPorcentajeAumento)
  return result
}

/**
 * Calcula el SAC (Sueldo Anual Complementario) para un formulario y datasets de sueldos.
 * 
 * El cálculo se realiza solo si se completan todos los meses de un semestre (primer o segundo).
 * Se determina el sueldo más alto del semestre, se calcula el monto bruto del SAC (la mitad del sueldo más alto),
 * y luego se aplican los descuentos correspondientes (jubilación, Ley 19032, OSUNSAM, APUNSAM).
 * 
 * @param formulario - Datos del formulario del empleado.
 * @param sueldosBasicos - Dataset de sueldos básicos por mes.
 * @param adicionales - Dataset de adicionales por mes.
 * @param options - Opciones de cálculo, incluyendo los meses y el año.
 * @returns Un objeto con los montos calculados del SAC y sus descuentos, o ceros si no corresponde.
 */
export function calcularSac(
  formulario: Formulario,
  sueldosBasicos: DatasetSueldosBasicos[],
  adicionales: DatasetAdicionales[],
  options: calcularSueldosOptions,
): CalculosSac {
  const primerSemestre = options.meses.filter((m) => ['1', '2', '3', '4', '5', '6'].includes(m)).length === 6
  const segundoSemestre = options.meses.filter((m) => ['7', '8', '9', '10', '11', '12'].includes(m)).length === 6
  if (primerSemestre || segundoSemestre) {
    const createMonths = options.meses.map((m) => createMonthsObject(m, options.año))
    const sueldosBasicosCast = sueldosBasicos.map((sb) => castSueldosBasicos(sb, options.ars))
    const adicionalesCast = adicionales.map((a) => castAdicionales(a, options.ars))
    const sueldosPorMes = calcularSueldoPorMes(formulario, createMonths, sueldosBasicosCast, adicionalesCast)
    const sueldoMasAlto = sueldosPorMes.reduce((acc, cur) =>
      cur.montosRemunerativos > acc.montosRemunerativos ? cur : acc
    )
    const montoBruto = roundUp(sueldoMasAlto.montosRemunerativos / 2)
    const montoJubilacion = calculosParciales.calcularJubilacion(montoBruto)

    const montoLey19032 = calculosParciales.calcularLey19032(montoBruto)

    const montoOsunsam = calculosParciales.calcularOsunsam(montoBruto)

    const montoApunsam = formulario.apunsam === 'SI'
      ? roundUp((sueldoMasAlto.montoSueldoBasico * JubilacionRatio.APUNSAM) / 2)
      : 0

    const montoTotalDescuentos = sumSueldos([
      montoJubilacion,
      montoLey19032,
      montoOsunsam,
      montoApunsam,
    ])
    const montoSueldoNeto = roundUp(montoBruto - montoTotalDescuentos)
    return {
      montoBruto,
      montoSueldoNeto,
      montoJubilacion,
      montoLey19032,
      montoOsunsam,
      montoApunsam,
    }
  } else {
    return {
      montoBruto: 0,
      montoSueldoNeto: 0,
      montoJubilacion: 0,
      montoLey19032: 0,
      montoOsunsam: 0,
      montoApunsam: 0,
    }
  }
}
}
