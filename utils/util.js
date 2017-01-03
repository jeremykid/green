function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime2(theDate) {
  var now_time = new Date();
  var interval = (now_time - theDate)/1000;
  
  if (interval < 60) {
    return "刚刚";
  } else if (interval < 3600) {
    return (interval/60|0)+"分钟前";
  } else if (theDate.toDateString() == now_time.toDateString()) {
    return "今天"+theDate.getHours()+":"+(theDate.getMinutes()<10?'0':'')+theDate.getMinutes();
  } else if (theDate.getFullYear() == theDate.getFullYear()){
    return (theDate.getMonth()+1)+"-"+theDate.getDate()
  } else {
    return theDate.getFullYear()+"-"+(theDate.getMonth()+1)+"-"+theDate.getDate()
  }
  
}

function formatTimeForDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()  
  return [year, month, day].map(formatNumber).join('-') 
}

function formatTimeForTime(date) {  
  var hour = date.getHours()
  var minute = date.getMinutes()  
  return [hour, minute].map(formatNumber).join(':')
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTimeForDate:formatTimeForDate,
  formatTimeForTime:formatTimeForTime
}
