/** 类 */

class DealTime {
  constructor() {  //用于添加属性

  }
  dealDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? 0 + '' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}`;
  }
}

export default DealTime