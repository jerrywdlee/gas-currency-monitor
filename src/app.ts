import { Spreadsheet as S, Transport as T } from './lib/'
import { Test } from './Test'

global.test = () => {
  const test = new Test()
  // Logger.log(JSON.stringify(getCellPairs('B:C')))
  test.echo('new world.')
  updateValsByKeys({ currentRate: 17 }, 'B:C', { sheetName: 'settings' })
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

  const settings = getCellPairs('B:C')
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

function getCellPairs(column: string): any {
  const sheet = S.connect({ sheetName: 'settings' })
  const range = sheet.getRange(column)
  const rows = range.getValues().filter(row => row[0])
  const values = {}
  rows.forEach(r => values[r[0].toString()] = r[1])
  return values
}

function updateValsByKeys(params: {}, column: string, opt: any) {
  const sheet = S.connect(opt)
  const range = sheet.getRange(column)

  const keys = Object.keys(params)
  const keyLocats = {}
  range.getValues().forEach((row, i) => {
    const k = row[0].toString()
    if (keys.indexOf(k) !== -1) {
      keyLocats[k] = i + 1
    }
  })
  const keyCol = column.split(':')[1]
  keys.forEach(k => {
    const cellId = `${keyCol}${keyLocats[k]}`
    const cell = sheet.getRange(cellId)
    cell.setValue(params[k])
  })
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
