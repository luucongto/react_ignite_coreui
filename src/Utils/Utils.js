module.exports={
  formatNumber(num){
    try{
      num = parseFloat(num)
      if(num < 1) return num.toFixed(4)
      if(num < 10) return num.toFixed(3)
      if(num < 100) return num.toFixed(2)
      if(num < 1000) return num.toFixed(1)
      return num.toFixed(0)
    } catch(e){
      return num
    }
    
  }
}