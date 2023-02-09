module.exports = {
  formatNumber(num) {
    try {
      num = parseFloat(num)
      if (Math.abs(num) < 1) return parseFloat(num.toFixed(4))
      if (Math.abs(num) < 10) return parseFloat(num.toFixed(3))
      if (Math.abs(num) < 100) return parseFloat(num.toFixed(2))
      if (Math.abs(num) < 1000) return parseFloat(num.toFixed(1))
      return parseFloat(num.toFixed(0))
    } catch (e) {
      return num
    }
  },
  clone(object) {
    try {
      return JSON.parse(JSON.stringify(object))
    } catch (e) {
      return null
    }
  },
}
