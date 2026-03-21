declare module "jalaali-js" {
  interface JalaaliResult {
    jy: number;
    jm: number;
    jd: number;
  }
  interface GregorianResult {
    gy: number;
    gm: number;
    gd: number;
  }
  function toJalaali(gy: number, gm: number, gd: number): JalaaliResult;
  function toGregorian(jy: number, jm: number, jd: number): GregorianResult;
  function isValidJalaaliDate(jy: number, jm: number, jd: number): boolean;
  function isLeapJalaaliYear(jy: number): boolean;
  function jalaaliMonthLength(jy: number, jm: number): number;
  export default { toJalaali, toGregorian, isValidJalaaliDate, isLeapJalaaliYear, jalaaliMonthLength };
}
