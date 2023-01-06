// TODO: нужно уходить с moment, так как его поддержка скоро будет остановлена
import moment from 'moment'

export const formatDate = (date: string | number): string => {
  return moment(date).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')
}

export const formatDateWithoutLocal = (date: string | number): string => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const toUnixTime = (date: string): number => {
  return moment(date).add(3, 'hours').unix()
}

