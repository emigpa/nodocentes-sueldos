import type {
  Apunsam,
  Categoria,
  Formulario,
  Permanencia,
  RiesgoFallo,
  Sueldo,
  SueldosBasicos,
  Titulo,
} from './types.ts'
import {
  AdicionalCapacitacionRatio,
  AdicionalGradoRatio,
  AdicionalTituloRatio,
  AntiguedadPermanenciaRatio,
  HijosRatio,
  HorasExtraRatio,
  JubilacionRatio,
  RiesgoFalloRatio,
} from './types.ts'
import { roundUp } from './utils.ts'

/**
 * Calculates permanancia seniority.
 * La permanencia se calcula el sueldo basico de la categoria en relacion al sueldo basico de la categoria superior
 * categoria anterior multiplicada por un indice.
 * Ej: categoria2 = (categoria 1 - categoria 2) * 0.07
 * @param basicos - The object containing basic salaries for each category.
 * @param categoria - The category of the employee.
 * @param permanencia - The seniority of the employee.
 * @returns The calculated Permanencia.
 */
export function calcularPermanencia(basicos: SueldosBasicos, categoria: Categoria, permanencia: Permanencia): Sueldo {
  const cat1 = () =>
    (basicos['CATEGORIA 1'] * AntiguedadPermanenciaRatio.base) * AntiguedadPermanenciaRatio[permanencia]
  const cat2 = () =>
    (basicos['CATEGORIA 1'] - basicos['CATEGORIA 2']) *
    AntiguedadPermanenciaRatio[permanencia]
  const cat3 = () =>
    (basicos['CATEGORIA 2'] - basicos['CATEGORIA 3']) *
    AntiguedadPermanenciaRatio[permanencia]
  const cat4 = () =>
    (basicos['CATEGORIA 3'] - basicos['CATEGORIA 4']) *
    AntiguedadPermanenciaRatio[permanencia]
  const cat5 = () =>
    (basicos['CATEGORIA 4'] - basicos['CATEGORIA 5']) *
    AntiguedadPermanenciaRatio[permanencia]
  const cat6 = () =>
    (basicos['CATEGORIA 5'] - basicos['CATEGORIA 6']) *
    AntiguedadPermanenciaRatio[permanencia]
  const cat7 = () =>
    (basicos['CATEGORIA 6'] - basicos['CATEGORIA 7']) *
    AntiguedadPermanenciaRatio[permanencia]
  const categoriaSeleccionada = categoria === 'CATEGORIA 1'
    ? cat1()
    : categoria === 'CATEGORIA 2'
    ? cat2()
    : categoria === 'CATEGORIA 3'
    ? cat3()
    : categoria === 'CATEGORIA 4'
    ? cat4()
    : categoria === 'CATEGORIA 5'
    ? cat5()
    : categoria === 'CATEGORIA 6'
    ? cat6()
    : categoria === 'CATEGORIA 7'
    ? cat7()
    : 0
  return roundUp(categoriaSeleccionada)
}

/**
 * Calculates Adicional de grado for a given set of basic salaries and category.
 * El adicional de grado se computa multiplicando el sueldo basico de la categoria por un indice.
 * Ej: categoria1 * 0.06
 * @param basicos - The basic salaries.
 * @param categoria - The category.
 * @returns The calculated additional grade.
 */
export function calcularAdicionalGrado(basicos: SueldosBasicos, categoria: Categoria): Sueldo {
  const cat1 = () => basicos['CATEGORIA 1'] * AdicionalGradoRatio['CATEGORIA 1']
  const cat2 = () => basicos['CATEGORIA 2'] * AdicionalGradoRatio['CATEGORIA 2']
  const cat3 = () => basicos['CATEGORIA 3'] * AdicionalGradoRatio['CATEGORIA 3']
  const cat4 = () => basicos['CATEGORIA 4'] * AdicionalGradoRatio['CATEGORIA 4']
  const cat5 = () => basicos['CATEGORIA 5'] * AdicionalGradoRatio['CATEGORIA 5']
  const cat6 = () => basicos['CATEGORIA 6'] * AdicionalGradoRatio['CATEGORIA 6']
  const cat7 = () => basicos['CATEGORIA 7'] * AdicionalGradoRatio['CATEGORIA 7']
  const categoriaSeleccionada = categoria === 'CATEGORIA 1'
    ? cat1()
    : categoria === 'CATEGORIA 2'
    ? cat2()
    : categoria === 'CATEGORIA 3'
    ? cat3()
    : categoria === 'CATEGORIA 4'
    ? cat4()
    : categoria === 'CATEGORIA 5'
    ? cat5()
    : categoria === 'CATEGORIA 6'
    ? cat6()
    : categoria === 'CATEGORIA 7'
    ? cat7()
    : 0
  return roundUp(categoriaSeleccionada)
}

/**
 * Calculates the Adicional de capacitacion based on the given basic salaries and category.
 * El adicional de capacitacion se computa multiplicando el sueldo basico de la categoria por un indice.
 * Ej: categoria1 * 0.06
 * @param basicos - The object containing basic salaries for each category.
 * @param categoria - The category for which the additional training bonus is calculated.
 * @returns The calculated Adicional de capacitacion.
 */
export function calcularAdicionalCapacitacion(basicos: SueldosBasicos, categoria: Categoria): Sueldo {
  const cat1 = () => basicos['CATEGORIA 1'] * AdicionalCapacitacionRatio['CATEGORIA 1']
  const cat2 = () => basicos['CATEGORIA 2'] * AdicionalCapacitacionRatio['CATEGORIA 2']
  const cat3 = () => basicos['CATEGORIA 3'] * AdicionalCapacitacionRatio['CATEGORIA 3']
  const cat4 = () => basicos['CATEGORIA 4'] * AdicionalCapacitacionRatio['CATEGORIA 4']
  const cat5 = () => basicos['CATEGORIA 5'] * AdicionalCapacitacionRatio['CATEGORIA 5']
  const cat6 = () => basicos['CATEGORIA 6'] * AdicionalCapacitacionRatio['CATEGORIA 6']
  const cat7 = () => basicos['CATEGORIA 7'] * AdicionalCapacitacionRatio['CATEGORIA 7']
  const categoriaSeleccionada = categoria === 'CATEGORIA 1'
    ? cat1()
    : categoria === 'CATEGORIA 2'
    ? cat2()
    : categoria === 'CATEGORIA 3'
    ? cat3()
    : categoria === 'CATEGORIA 4'
    ? cat4()
    : categoria === 'CATEGORIA 5'
    ? cat5()
    : categoria === 'CATEGORIA 6'
    ? cat6()
    : categoria === 'CATEGORIA 7'
    ? cat7()
    : 0
  return roundUp(categoriaSeleccionada)
}

/**
 * Calculates the Adicional por titulo based on the given basic salaries, category, and title.
 * El adicional por titulo se computa multiplicando el sueldo basico de la categoria por un indice en base al titulo.
 * Ej: categoria1 * 0.175
 * @param basicos - The basic salaries.
 * @param categoria - The category.
 * @param titulo - The title.
 * @returns The calculated Adicional por titulo.
 */
export function calcularAdicionalTitulo(basicos: SueldosBasicos, categoria: Categoria, titulo: Titulo): Sueldo {
  const primario = AdicionalTituloRatio.Primario
  const secundario = basicos['CATEGORIA 7'] * AdicionalTituloRatio.Secundario
  const terciario = basicos[categoria] * AdicionalTituloRatio.Terciario
  const tgu = basicos[categoria] * AdicionalTituloRatio.TGU
  const universitario = basicos[categoria] * AdicionalTituloRatio.Universitario
  const posgrado = basicos[categoria] * AdicionalTituloRatio.Posgrado
  const tituloSeleccionado = titulo === 'Primario'
    ? primario
    : titulo === 'Secundario'
    ? secundario
    : titulo === 'Terciario'
    ? terciario
    : titulo === 'TGU'
    ? tgu
    : titulo === 'Universitario'
    ? universitario
    : titulo === 'Posgrado'
    ? posgrado
    : 0
  return roundUp(tituloSeleccionado)
}

/**
 * Calculates the salary based on the years of service.
 * Se calcula cada año de antiguedad como el basico de la categoria multiplicado por 0.02,
 * luego se multiplica por la cantidad de años de antiguedad.
 * Ej: categoria1 * 0.02 * 2
 * @param basicos - The basic salaries.
 * @param categoria - The category of the employee.
 * @param antiguedad - The number of years of service.
 * @returns The calculated salary.
 */
export function calcularAntiguedad(basicos: SueldosBasicos, categoria: Categoria, antiguedad: number): Sueldo {
  const montoPorAnio = basicos[categoria] * 0.02
  return roundUp(montoPorAnio * antiguedad)
}

/**
 * Calculates the Suplemento (subrogancia) for a given form and basic salaries.
 * El suplemento es el monto del suplemento - monto del sueldo basico.
 * @param formulario - The form data.
 * @param sueldosBasicos - The basic salaries data.
 * @returns El monto a suplementar o 0.
 */
export function calcularSuplemento(formulario: Formulario, sueldosBasicos: SueldosBasicos): Sueldo {
  if (formulario.suplementoCategoria !== 'SIN SUPLEMENTO') {
    const montoAntiguedad = calcularAntiguedad(
      sueldosBasicos,
      formulario.categoria,
      formulario.antiguedad,
    )
    const montoAdicionalTitulo = calcularAdicionalTitulo(
      sueldosBasicos,
      formulario.categoria,
      formulario.titulo,
    )
    const montoAntiguedadSuplemento = calcularAntiguedad(
      sueldosBasicos,
      formulario.suplementoCategoria,
      formulario.antiguedad,
    )
    const montoAdicionalTituloSuplemento = calcularAdicionalTitulo(
      sueldosBasicos,
      formulario.suplementoCategoria,
      formulario.titulo,
    )
    const diferenciaAntiguedad = montoAntiguedadSuplemento - montoAntiguedad
    const diferenciaTitulo = montoAdicionalTituloSuplemento -
      montoAdicionalTitulo
    const sueldoBasico = sueldosBasicos[formulario.categoria]
    const suplemento = sueldosBasicos[formulario.suplementoCategoria]
    return roundUp(
      (suplemento + diferenciaAntiguedad + diferenciaTitulo) - sueldoBasico,
    )
    // Si no tiene suplemento seleccionado, esta funcion deberia devolver un monto igual a 0 para que sume 0.
  } else {
    return 0
  }
}

/**
 * Calculates the Riesgo or Fallo de caja.
 * No pueden ser las dos en simultáneo.
 * @param basicos - The object containing the basicos values.
 * @param categoria - The categoria value.
 * @param riesgofallo - The riesgofallo value.
 * @returns The calculated sueldo.
 */
export function calcularRiesgoFallo(basicos: SueldosBasicos, categoria: Categoria, riesgofallo: RiesgoFallo): Sueldo {
  const fallo = basicos['CATEGORIA 7'] * RiesgoFalloRatio.FALLO
  const riesgo = basicos[categoria] * RiesgoFalloRatio.RIESGO
  return riesgofallo === 'FALLO' ? fallo : riesgofallo === 'RIESGO' ? riesgo : riesgofallo === 'NO' ? 0 : 0
}

/**
 * Calculates extra por Hijo based on the number of children.
 *
 * @param basicos - The basic salaries.
 * @param hijos - The number of children.
 * @returns The calculated salary.
 */
export function calcularHijos(basicos: SueldosBasicos, hijos: number): Sueldo {
  return roundUp((basicos['CATEGORIA 7'] * HijosRatio.ratio) * hijos)
}

/**
 * Calculates the amount of Horas extras for working additional hours at a rate of 50%.
 *
 * @param bruto - The gross salary.
 * @param horas - The number of additional hours worked (default: 0).
 * @returns The amount of extra pay for working additional hours at a rate of 50%.
 */
export function calcularHorasExtraCincuenta(bruto: Sueldo, horas = 0): Sueldo {
  const cincuenta = (bruto / 140) * HorasExtraRatio.CINCUENTA
  return roundUp(horas * cincuenta)
}

/**
 * Calculates the amount of Horas extras for working additional hours at a rate of 100%.
 *
 * @param bruto - The gross salary.
 * @param horas - The number of additional hours worked (default: 0).
 * @returns The amount of extra pay for working additional hours at a rate of 100%.
 */
export function calcularHorasExtraCien(bruto: Sueldo, horas = 0): Sueldo {
  const cien = (bruto / 140) * HorasExtraRatio.CIEN
  return roundUp(horas * cien)
}

/**
 * Calculates the Jubilacion amount based on the given remunerative gross salary.
 * @param brutoRemunerativo The remunerative gross salary.
 * @returns The jubilation amount.
 */
export function calcularJubilacion(brutoRemunerativo: Sueldo): Sueldo {
  return roundUp(brutoRemunerativo * JubilacionRatio.JUBILACION)
}

/**
 * Calculates the sueldo according to Ley 19032.
 *
 * @param brutoRemunerativo The remunerative gross salary.
 * @returns The calculated sueldo.
 */
export function calcularLey19032(brutoRemunerativo: Sueldo): Sueldo {
  return roundUp(brutoRemunerativo * JubilacionRatio.LEY19032)
}

/**
 * Calculates the OSUNSAM deduction from the given remunerative gross salary.
 * @param brutoRemunerativo The remunerative gross salary.
 * @returns The deducted OSUNSAM amount.
 */
export function calcularOsunsam(brutoRemunerativo: Sueldo): Sueldo {
  return roundUp(brutoRemunerativo * JubilacionRatio.OSUNSAM)
}

/**
 * Calculates the Apunsam amount for a given set of basic salaries, category, and Apunsam flag.
 * @param basicos - The object containing the basic salaries for each category.
 * @param categoria - The category of the employee.
 * @param apunsam - The Apunsam flag indicating whether the employee is eligible for Apunsam or not.
 * @returns The calculated Apunsam amount if the employee is eligible, otherwise 0.
 */
export function calcularApunsam(basicos: SueldosBasicos, categoria: Categoria, apunsam: Apunsam): Sueldo {
  return apunsam === 'SI' ? roundUp(basicos[categoria] * JubilacionRatio.APUNSAM) : 0
}
