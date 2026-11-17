import React from 'react'

interface BankLogoProps {
  bank: 'Nubank' | 'Santander' | 'Itaú' | 'Bradesco' | 'Banco Inter' | string
  className?: string
}

export const BankLogo: React.FC<BankLogoProps> = ({ bank, className = 'w-6 h-6' }) => {
  const normalized = bank.toLowerCase()

  if (normalized.includes('nu')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#820AD1] flex items-center justify-center text-white font-extrabold text-[11px] tracking-tighter shrink-0 select-none shadow-sm`}
        title="Nubank"
      >
        nu
      </div>
    )
  }

  if (normalized.includes('santander')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#EC0000] flex items-center justify-center text-white shrink-0 shadow-sm p-1`}
        title="Santander"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C10.5 5 7.5 7.5 7.5 11c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-3.5-3-6-4.5-9z" opacity="0.9"/>
          <path d="M16 13c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-1.2.5-2.2 1.3-3 .7 1.2 1.8 2 3.2 2s2.5-.8 3.2-2c.3.8.3 2 .3 3z"/>
        </svg>
      </div>
    )
  }

  if (normalized.includes('ita')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#EC7000] flex items-center justify-center shrink-0 shadow-sm p-0.5 overflow-hidden`}
        title="Itaú"
      >
        <div className="w-full h-full bg-[#002855] rounded-[5px] flex items-center justify-center text-[#FFF100] font-bold text-[9px] tracking-tight">
          itaú
        </div>
      </div>
    )
  }

  if (normalized.includes('bradesco')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#CC092F] flex items-center justify-center text-white shrink-0 shadow-sm p-1`}
        title="Bradesco"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <circle cx="12" cy="7" r="2.5" />
          <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6H6z" opacity="0.8" />
          <path d="M8.5 18c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5H8.5z" />
        </svg>
      </div>
    )
  }

  if (normalized.includes('brasil') || normalized.includes('bb')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#FFF100] border border-[#FACC15] flex items-center justify-center text-[#003882] font-black text-[9px] tracking-tight shrink-0 shadow-sm`}
        title="Banco do Brasil"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" opacity="0.9" />
        </svg>
      </div>
    )
  }

  if (normalized.includes('caixa')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#005CA9] flex items-center justify-center font-black text-white shrink-0 shadow-sm overflow-hidden select-none`}
        title="Caixa Econômica Federal"
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <span className="text-white font-black text-[12px] italic tracking-tighter">X</span>
          <span className="absolute w-2 h-0.5 bg-[#F58220] rounded-full rotate-45" />
        </div>
      </div>
    )
  }

  if (normalized.includes('inter')) {
    return (
      <div
        className={`${className} rounded-lg bg-[#FF7A00] flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm`}
        title="Banco Inter"
      >
        in
      </div>
    )
  }

  return (
    <div
      className={`${className} rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0`}
    >
      {bank.slice(0, 2).toUpperCase()}
    </div>
  )
}
