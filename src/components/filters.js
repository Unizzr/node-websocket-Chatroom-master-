export const RECALL_TIME_LIMIT = 5 * 60 * 1000;

export const friendlyTime = (value) => {
  let time=new Date().getTime();
  time=parseInt((time-value)/1000);
  //存储转换值
  let s;
  if(time<60*3){//三分钟内
    return '刚刚';
  }else if((time<60*60)&&(time>=60*3)){
    //超过十分钟少于1小时
    s = Math.floor(time/60);
    return  s+"分钟前";
  }else if((time<60*60*24)&&(time>=60*60)){
    //超过1小时少于24小时
    s = Math.floor(time/60/60);
    return  s+"小时前";
  }else if((time<60*60*24*3)&&(time>=60*60*24)){
    //超过1天少于3天内
    s = Math.floor(time/60/60/24);
    return s+"天前";
  }else{
    //超过3天
    let date= new Date(value);
    return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
  }
}
export const formatTime = (value) => {
  let date=new Date(value);
  let year=date.getFullYear();
  let month=date.getMonth()+1;
  let day=date.getDate();
  let hour=date.getHours()>9?date.getHours():("0"+date.getHours());
  let minutes=date.getMinutes()>9?date.getMinutes():("0"+date.getMinutes());
  let seconds=date.getSeconds()>9?date.getSeconds():("0"+date.getSeconds());
  return year+"."+month+"."+day+" "+hour+":"+minutes+":"+seconds;
}

export const canRecall = (message) => {
  if (!message) return false;
  if (message.isRecalled) return false;
  const now = new Date().getTime();
  const timeDiff = now - message.time;
  return timeDiff <= RECALL_TIME_LIMIT;
}

export const getRecallRemainingTime = (messageTime) => {
  const now = new Date().getTime();
  const timeDiff = now - messageTime;
  const remaining = RECALL_TIME_LIMIT - timeDiff;
  if (remaining <= 0) return { minutes: 0, seconds: 0 };
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return { minutes, seconds };
}

export const formatRecallTime = (minutes, seconds) => {
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}
