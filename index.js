const request = require('request-promise-native')
const numeral = require('numeral')

const CONNECTOR_URL = process.env.CONNECTOR_URL || 'https://localhost:9003'

process.env.SLACK_WEBHOOK_URI || console.error('SLACK_WEBHOOK_URI not set') || process.exit(1)

function formatCurrency (pennies) {
  return '£' + numeral(pennies / 100.0).format('0,0.00')
}

function PerformanceReport (title, totalVolume, totalAmount, averageAmount) {
  return {
    title: title,
    fields: [{
      title: 'Total payments',
      value: numeral(totalVolume).format('0,0'),
      short: false
    },{
      title: 'Total amount',
      value: formatCurrency(totalAmount),
      short: true,
    },{
      title: 'Average amount',
      value: formatCurrency(averageAmount),
      short: true,
    }]
  };
}

function TotalPerformanceReport () {
  return request
    .get(CONNECTOR_URL + '/v1/api/reports/performance-report')
    .then(body => JSON.parse(body))
    .then(parsed => PerformanceReport(
      'Total performance',
      parsed.total_volume,
      parsed.total_amount,
      parsed.average_amount
    ))
}

function ReportSeparator () {
  return {
    text: new Array(10).fill(':chart:').join(' ')
  }
}

function DaysAgoPerformanceReport (title, daysAgo) {
  let timestamp = new Date()
  timestamp.setDate(timestamp.getDate() - daysAgo)
  timestamp.setUTCHours(0)
  timestamp.setUTCMinutes(0)
  timestamp.setUTCSeconds(0)
  timestamp.setUTCMilliseconds(0)
  timestamp = timestamp.toISOString()

  const url = CONNECTOR_URL + `/v1/api/reports/daily-performance-report`

  return request
    .get(url, {qs: {date: timestamp }})
    .then(body => JSON.parse(body))
    .then(parsed => PerformanceReport(
      title,
      parsed.total_volume,
      parsed.total_amount,
      parsed.average_amount
    ))
}

function YesterdaysPerformanceReport () {
  return DaysAgoPerformanceReport('Yesterday', 1)
}

function ThisDayLastYearPerformanceReport () {
  return DaysAgoPerformanceReport('This day last year', 365)
}

function SlackMessage (reports) {
  return {
    attachments: reports,
    channel:     '#pay-stats-test',
    username:    'paybot',
    icon_emoji:  ':fine:',
    link_names:  1,
  }
}

Promise
.all([
  ReportSeparator(),
  TotalPerformanceReport(),
  ReportSeparator(),
  YesterdaysPerformanceReport(),
  ReportSeparator(),
  ThisDayLastYearPerformanceReport(),
  ReportSeparator(),
])
.then(reports => SlackMessage(reports))
.then(message => {
  return request({
    method: 'POST',
    url:    process.env.SLACK_WEBHOOK_URI,
    json:   message,
  })
})
.catch(err => console.error(err) && process.exit(1))
