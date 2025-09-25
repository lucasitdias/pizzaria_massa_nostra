// src/config/logger.ts
import { createLogger, format, transports } from 'winston'
import type { TransformableInfo } from 'logform'

// Cria logger com formato seguro e compatível com TypeScript
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    format.printf((info: TransformableInfo) => {
      const { timestamp, level, message } = info
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: [
    new transports.Console()
  ]
})

// Exporta diretamente o logger (sem encapsular em funções que retornam void)
export default logger
