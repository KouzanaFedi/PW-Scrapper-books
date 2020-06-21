const format = require('date-fns/format')

function formatStrings(string) {
    if (typeof string != 'string') return
    let formattedS = string.trim();
    formattedS = formattedS.charAt(0).toUpperCase() + formattedS.slice(1);

    return formattedS
}

function formatDate(toFormat) {
    let [date, time] = toFormat.split('@');
    dateParts = date.trim().split('/');
    date = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
    time = formatTime(time);
    return `${date} ${time}`;
}

function getCreatedDate() {
    return format(new Date(), 'yyyy-MM-dd kk:mm:ss')
}

function formatTime(time) {
    timeRegEx = new RegExp(/([0-1][0-9]):([0-5][0-6]) *([A|P]M)/, 'i');
    parsedTime = time.match(timeRegEx);

    hours = parseInt(parsedTime[1]);
    minutes = parsedTime[2];
    timePeriod = parsedTime[3];

    hours = hours + (timePeriod.toUpperCase() === 'AM' ? 0 : 12)
    return `${hours}:${minutes}:00.00`;
}

module.exports = {
    formatStrings,
    formatDate,
    getCreatedDate
}