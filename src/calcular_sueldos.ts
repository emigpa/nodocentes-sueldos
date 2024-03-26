import { Adicionales, Calculos, Formulario, Meses, SueldosBasicos } from './types.ts'
import { calcularPorcentaje, roundUp, sumSueldos } from './utils.ts'
import { filterAdicionalesPorFecha, findSueldosBasicosPorFecha, sueldosBasicosOnTimeline } from './data_parser.ts'
import * as calculosParciales from './calculos_parciales.ts'

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

      const montoHijos = calculosParciales.calcularHijos(m.sueldosBasicos, formulario.hijos)

      const adicionalesNoRemunerativos = sumSueldos(
        m.adicionales
          .filter((a: Adicionales) => a.REMUNERATIVO === 'NO')
          .map((a: Adicionales) => a[formulario.categoria]),
      )

      const adicionalesRemunerativos = sumSueldos(
        m.adicionales
          .filter((a) => a.REMUNERATIVO === 'SI')
          .map((a) => a[formulario.categoria]),
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
          monto: a[formulario.categoria],
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
      }
    })
}

export function calcularSueldosConPorcentajeAumento(sueldosPorMes: Calculos[]): Calculos[] {
  return sueldosPorMes
    .map((s, i, a) => {
      if (i === 0) {
        return {
          ...s,
          porcentajeAumento: 0,
        }
      } else {
        const montoSueldoAnterior = a[i - 1].montoSueldoBruto
        const montoSueldoActual = s.montoSueldoBruto
        const porcentajeAumento = calcularPorcentaje(
          montoSueldoAnterior,
          montoSueldoActual,
        )
        return {
          ...s,
          porcentajeAumento,
        }
      }
    })
}

export function calcularSueldos(
  formulario: Formulario,
  meses: Meses[],
  sueldosBasicos: SueldosBasicos[],
  adicionales: Adicionales[],
): Calculos[] {
  const sueldosPorMes = calcularSueldoPorMes(formulario, meses, sueldosBasicos, adicionales)
  const sueldosConPorcentajeAumento = calcularSueldosConPorcentajeAumento(sueldosPorMes)
  return sueldosConPorcentajeAumento
}
