import Alert from 'react-s-alert'

export const alertError = (message) => {
  Alert.error(message, {
    position: 'bottom-right',
    effect: 'bouncyflip',
  })
}

export const alertSuccess = (message) => {
  Alert.info(message, {
    position: 'bottom-right',
    effect: 'bouncyflip',
  })
}
