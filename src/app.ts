import { Spreadsheet as S, Transport as T } from './lib/'
import { Test } from './Test'

global.test = () => {
  const test = new Test()
  Logger.log(JSON.stringify(getCellPairs()))
  test.echo('new world.')
}

global.doGet = (e) => {
  Logger.log(JSON.stringify(e))
  // Need run on dev console and apply your app can connect to Spreadsheets
  const sheet = S.connect()
  sheet.appendRow([(new Date()).toLocaleString(), JSON.stringify(e)])
  return T.text('foo')
}

global.getCurrencyRate = () => {
  const url = 'https://www.payforex.net/wpinf/ajax/wprate.ashx'
  const res = T.get(url)
  const json = JSON.parse(res.getContentText())
  const keys = ['CNYJPY', 'sCNYJPY']
  const vals = keys.map((k) => json[k])
  const sheet = S.connect({ sheetName: 'currency_records' })
  sheet.appendRow([(new Date()).toLocaleString(), ...vals])

  const settings = getCellPairs()
  const averageRate = settings.AVG_CNYJPY
  const cnyJpy = vals[0]
  if (cnyJpy < averageRate) {
    const p = {
      rate: cnyJpy,
      slackName: settings.slackName,
      clickUrl: settings.clickUrl,
      chartUrl: settings.chartImage,
    }
    const slackUrl = settings.slackUrl
    const payload = formSlackMsg(p)
    sendToSlack(slackUrl, payload)
    Logger.log(slackUrl)
    Logger.log(JSON.stringify(p))
  }
  Logger.log(vals)
  return
}

// function checkAverageRate(): any {
//   const sheet = S.connect({ sheetName: 'chart' })
//   const range = sheet.getRange('K2')
//   const value = range.getValue()
//   return value
// }

function formSlackMsg(params: { rate: string, slackName: string, clickUrl: string, chartUrl: string }): SlackPayload {
  const attach = {
    fallback: 'Rate Chart',
    image_url: params.chartUrl,
  }
  const msg = {
    text: `<@${params.slackName}> Low Rate! _*${params.rate}*_ !! \n<${params.clickUrl}>`,
    attachments: [attach],
  }
  return msg
}

function sendToSlack(url: string, payload: SlackPayload) {
  const params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  }
  UrlFetchApp.fetch(url, params)
}

function getCellPairs(): any {
  const sheet = S.connect({ sheetName: 'settings' })
  const range = sheet.getRange('B:C')
  const rows = range.getValues().filter(row => row[0])
  const values = {}
  rows.forEach(r => values[r[0].toString()] = r[1])
  return values
}

interface SlackPayload {
  text: string,
  username?: string,
  icon_url?: string,
  icon_emoji?: string,
  channel?: string,
  attachments?: SlackAttachment[]
}

interface SlackAttachment {
  // see https://api.slack.com/docs/message-attachments
  fallback: string,
  text?: string,
  pretext?: string,
  color?: string,
  image_url?: string,
  fields?: SlackAttachField[]
}

interface SlackAttachField {
  title?: string,
  value?: string,
  short?: boolean
}
