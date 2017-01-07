function formatTime(date) {
  if(!date) {
    return '出错了'
  }
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
    return (theDate.getMonth()+1)+"月"+theDate.getDate()+"日"
  } else {
    return theDate.getFullYear()+"-"+(theDate.getMonth()+1)+"-"+theDate.getDate()
  }
}

function formatTime3(theDate) {
  var now_time = new Date();
  var interval = (theDate - now_time)/1000;
  if (interval <= 0) {
    return "已经";
  } else if(interval < 60) {
    return "1分钟内";
  } else if (interval < 3600) {
    return (interval/60|0)+"分钟后";
  } else if (interval < 3600*24) {
    return (interval/3600|0)+"小时"+(interval%3600/60|0)+"分钟后";
  } else {
    return (interval/(3600*24)|0)+"天"+(interval%(3600*24)/3600|0)+"小时"+(interval%(3600*24)%3600/60|0)+"分钟后";
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
  formatTime3: formatTime3,
  formatTimeForDate:formatTimeForDate,
  formatTimeForTime:formatTimeForTime
}
