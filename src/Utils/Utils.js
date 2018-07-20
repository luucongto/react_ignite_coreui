module.exports={
  formatNumber(num){
    try{
      num = parseFloat(num)
      return num > 10 ? num.toFixed(2): num.toFixed(3)
    } catch(e){
      return num
    }
    
  }
}