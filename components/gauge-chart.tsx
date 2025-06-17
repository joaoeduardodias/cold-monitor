"use client"

import { useEffect, useState } from "react"

interface GaugeChartProps {
  value: number
  min: number
  max: number
  unit: string
  type: "temperature" | "pressure"
  size?: number
}

export function GaugeChart({ value, min, max, unit, type, size = 80 }: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(min)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setAnimatedValue(value)
      setIsAnimating(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  // Calcular o ângulo baseado no valor (180 graus = semicírculo)
  const percentage = Math.max(0, Math.min(100, ((animatedValue - min) / (max - min)) * 100))
  const angle = (percentage / 100) * 180 - 90 // -90 para começar na esquerda

  // Cores baseadas no tipo e valor
  const getColor = () => {
    if (type === "temperature") {
      if (animatedValue < -20) return "#3b82f6" // Azul para muito frio
      if (animatedValue < -18) return "#10b981" // Verde para normal
      if (animatedValue < -15) return "#f59e0b" // Amarelo para atenção
      return "#ef4444" // Vermelho para crítico
    } else {
      if (animatedValue < 100 || animatedValue > 102) return "#ef4444" // Vermelho para fora do range
      if (animatedValue < 100.5 || animatedValue > 101.5) return "#f59e0b" // Amarelo para atenção
      return "#10b981" // Verde para normal
    }
  }

  const color = getColor()
  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  // Coordenadas da ponta da agulha
  const needleX = centerX + Math.cos((angle * Math.PI) / 180) * (radius - 5)
  const needleY = centerY + Math.sin((angle * Math.PI) / 180) * (radius - 5)

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size * 0.7} className="overflow-visible">
          {/* Arco de fundo */}
          <path
            d={`M 10 ${centerY} A ${radius} ${radius} 0 0 1 ${size - 10} ${centerY}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Arco colorido baseado no valor */}
          <path
            d={`M 10 ${centerY} A ${radius} ${radius} 0 0 1 ${size - 10} ${centerY}`}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * Math.PI * radius} ${Math.PI * radius}`}
            className={`transition-all duration-1000 ease-out ${isAnimating ? "animate-pulse" : ""}`}
          />

          {/* Marcações */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const markAngle = (mark / 100) * 180 - 90
            const markX1 = centerX + Math.cos((markAngle * Math.PI) / 180) * (radius - 8)
            const markY1 = centerY + Math.sin((markAngle * Math.PI) / 180) * (radius - 8)
            const markX2 = centerX + Math.cos((markAngle * Math.PI) / 180) * (radius - 2)
            const markY2 = centerY + Math.sin((markAngle * Math.PI) / 180) * (radius - 2)

            return <line key={mark} x1={markX1} y1={markY1} x2={markX2} y2={markY2} stroke="#6b7280" strokeWidth="2" />
          })}

          {/* Agulha */}
          <g className={`transition-transform duration-1000 ease-out ${isAnimating ? "animate-pulse" : ""}`}>
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#1f2937" />
          </g>
        </svg>

        {/* Valor no centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center mt-4">
            <div className={`text-lg font-bold transition-colors duration-500`} style={{ color }}>
              {animatedValue.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
