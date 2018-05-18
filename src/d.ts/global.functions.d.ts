interface Global {
  test(): void
  getCurrencyRate(): any
  doGet(e): any
  doPost(e): any
}

declare var global: Global
