import React from 'react'
import nubankSvg from '../assets/banks/nubank.svg'
import itauSvg from '../assets/banks/itau.svg'
import bradescoSvg from '../assets/banks/bradesco.svg'
import bbSvg from '../assets/banks/bb.svg'
import caixaSvg from '../assets/banks/caixa.svg'
import santanderSvg from '../assets/banks/santander.svg'
import interSvg from '../assets/banks/inter.svg'
import btgSvg from '../assets/banks/btg.svg'

interface BankLogoProps {
  bank: string
  className?: string
  alt?: string
}

export const BankLogo: React.FC<BankLogoProps> = ({ bank, className = 'w-6 h-6', alt }) => {
  const normalized = (bank || '').toLowerCase()

  if (normalized.includes('nu')) {
    return (
      <img
        src={nubankSvg}
        alt={alt || 'Nubank'}
        title="Nubank"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('santander')) {
    return (
      <img
        src={santanderSvg}
        alt={alt || 'Santander'}
        title="Santander"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('ita')) {
    return (
      <img
        src={itauSvg}
        alt={alt || 'Itaú'}
        title="Itaú"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('bradesco')) {
    return (
      <img
        src={bradescoSvg}
        alt={alt || 'Bradesco'}
        title="Bradesco"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('brasil') || normalized.includes('bb')) {
    return (
      <img
        src={bbSvg}
        alt={alt || 'Banco do Brasil'}
        title="Banco do Brasil"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('caixa')) {
    return (
      <img
        src={caixaSvg}
        alt={alt || 'Caixa'}
        title="Caixa Econômica Federal"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('inter')) {
    return (
      <img
        src={interSvg}
        alt={alt || 'Banco Inter'}
        title="Banco Inter"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  if (normalized.includes('btg')) {
    return (
      <img
        src={btgSvg}
        alt={alt || 'BTG Pactual'}
        title="BTG Pactual"
        className={`${className} object-contain rounded-md shrink-0 shadow-xs select-none`}
      />
    )
  }

  // Fallback for Pluggy or generic institutions
  return (
    <div
      className={`${className} rounded-md bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs uppercase shrink-0 select-none`}
      title={bank}
    >
      {bank.slice(0, 2)}
    </div>
  )
}
