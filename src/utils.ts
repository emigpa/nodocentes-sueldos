import { DateTime } from '../deps.ts'
import { Meses, Sueldo } from './types.ts'

/**
 * Casts a string to a DateTime object using the specified format and locale to es-AR.
 * @param fecha The string representation of the date.
 * @returns The DateTime object representing the parsed date.
 */
export function castFecha(fecha: string): DateTime {
  return DateTime.fromFormat(fecha, 'D', { locale: 'es-AR' })
}

/**
 * Formats the given amount as a currency string with format es-AR.
 * @param monto - The amount to format.
 * @returns The formatted currency string.
 */
export function formatCurrency(monto: string) {
  return Number(monto).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  })
}

/**
 * Converts a string representation of a sueldo (ARS) to a number.
 *
 * @param sueldo - The sueldo as a string.
 * @returns The sueldo as a number.
 */
export function sueldoARS2Number(sueldo: string): Sueldo {
  return Number(
    sueldo.replaceAll('$', '').replaceAll('.', '').replaceAll(',', '.'),
  )
}

/**
 * Converts a string representation of a sueldo to a number.
 *
 * @param sueldo - The sueldo as a string.
 * @returns The sueldo as a number.
 */
export function sueldo2Number(sueldo: string): Sueldo {
  return Number(
    sueldo.replaceAll('$', '').replaceAll(',', ''),
  )
}

/**
 * Rounds up a number to two decimal places.
 * @param num - The number to round up.
 * @returns The rounded up number.
 */
export function roundUp(num: Sueldo): Sueldo {
  return Number(
    (Math.floor((Math.pow(10, 2) * num) + 0.5) * Math.pow(10, -2)).toFixed(2),
  )
}

/**
 * Creates an object with the start and end dates of a given month and year.
 * @param month - The month (1-12).
 * @param año - The year as a string.
 * @returns An object with the start and end dates of the specified month and year.
 */
export function createMonthsObject(month: string, año: string): Meses {
  const DESDE = DateTime.fromObject({
    month: Number(month),
    year: parseInt(año),
  }).startOf('month').setLocale('es-AR')
  const HASTA = DateTime.fromObject({
    month: Number(month),
    year: parseInt(año),
  }).endOf('month').setLocale('es-AR')
  return { DESDE, HASTA }
}

/**
 * Calculates the sum of an array of sueldos.
 * @param sueldos - The array of sueldos to sum.
 * @returns The sum of the sueldos.
 */
export function sumSueldos(sueldos: Sueldo[]): Sueldo {
  return roundUp(sueldos.reduce((acc, cur) => acc + cur, 0))
}

/**
 * Calculates the percentage increase or decrease between two salary amounts.
 * @param montoSueldoAnterior - The previous salary amount.
 * @param montoSueldoActual - The current salary amount.
 * @returns The percentage increase or decrease between the two salary amounts.
 */
export function calcularPorcentaje(montoSueldoAnterior: Sueldo, montoSueldoActual: Sueldo): Sueldo {
  return roundUp(
    ((montoSueldoActual - montoSueldoAnterior) / montoSueldoAnterior) * 100,
  )
}
