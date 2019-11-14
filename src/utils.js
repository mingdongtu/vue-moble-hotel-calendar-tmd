/** 类 */

class DealTime {
  constructor() {  //用于添加属性

  }
  dealDate(date) {
    console.log('utils@@@@', date, date instanceof Date)
    if (!(date instanceof Date)) {
      date = new Date(date.replace(/\-/g, '/'));
      console.log('utils00', date)
    } else
      console.log('utils 12', date, date instanceof Date)
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    console.log('utils火说212~~~~', `${year}-${month}-${day}`, `${year}-${month}-${date.getDate()}`)

    return `${year}-${month}-${day}`;

  }
}

export default DealTime