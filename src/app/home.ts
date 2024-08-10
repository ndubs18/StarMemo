function formatDate(date : Date) {
    let newDate = '';
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    //time
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let monthString = month.toString();
    let dayString = day.toString();
    let yearString = year.toString();
    
    let hoursString = hours.toString();
    if(hours < 10) {
      hoursString = '0' + hoursString;
    }
    
    let minutesString = minutes.toString();
    if(minutes < 10) {
        minutesString = '0' + minutesString;
    }

    let secondsString = seconds.toString();
    if(seconds < 10) {
        secondsString = '0' + secondsString;
    }

    newDate = `${month}/${day}/${year} ${hoursString}:${minutesString}:${secondsString}`
    return newDate;

  }

  export {formatDate}