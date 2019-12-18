<template lang="html">
  <div class="calendar">
    <div class="cal-container" :style="wrapperStyle">
      <transition name="fade">
  <!-- <van-popup v-model="show"  position="bottom" > -->
        <div class="cal-wrapper"  v-if='show' :style="wrapperStyle">
          <div class="cal-mask" @click="hideDate"></div>
          <div class="cal-main" :style="mainStyle">
            <div class="cm-header">
              选择日期
              <div class="close-icon"><span class="iconfont iconfont_1" @click.stop='onConfirm'>取消</span></div>
            </div>
            <div class="cm-days">
              <div class="cm-days-item">一</div>
              <div class="cm-days-item">二</div>
              <div class="cm-days-item">三</div>
              <div class="cm-days-item">四</div>
              <div class="cm-days-item">五</div>
              <div class="cm-days-item holiday">六</div>
              <div class="cm-days-item holiday">日</div>
            </div>
            <!-- <div class="cm-fix">
              {{fixMonth}}
            </div> -->
            <div class="cm-main " >
              <div class="cm-month" v-for="(month, index) in calList" :key="index">
                <div class="cmm-header" v-text="getDateFormat(month.month)"></div>
                <div class="cmm-main">
                  <div class="day-item" :class="{'order': day.status, 'contain': day.contain}" v-for="(day, index) in month.days" :key="index" @click="selectDate(month, day)">                 
                    <div class="info num" :class="{'weekend': day.type === 'weekend','holiday': day.type === 'holiday', 'past': day.type === 'past'}">{{day.num}}</div>
                    <div class="info tag" v-if="day.num">{{day.status}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- </van-popup> -->
    </div>
  </div>
</template>

<script type="ecmascript-6">
import { dateFtt } from "./date";
import utils from "./utils.js";
import { Toast, Popup } from "vant";
import Vue from "vue";

export default {
  components: {
    [Popup.name]: Popup
  },
  data() {
    return {
      utils: new utils(),
      yearList: [],
      screenHeight: 0,
      show: false,
      zIndex: -1,
      date: null,
      calList: [],
      startDate: null,
      endDate: null,
      fixMonth: null,
      dayGap: 1,
      today: new Date(),

      multipleDate: {
        startDate: "",
        endDate: ""
      }
    };
  },
  props: {
    isFuture: {
      //是否选中未来时间
      type: Boolean,
      default: false
    },
    total: {
      type: Boolean,
      default: true
    },
    startText: {
      type: String,
      default: "入住"
    },
    endText: {
      type: String,
      default: "退房"
    },

    defaultEndDate: {
      type: String,
      default: ""
    },
    isMultiple: {
      //是否多选：默认单选
      type: Boolean,
      default: false
    },
    defaultStartDate: {
      type: String,
      default: ""
    }
  },
  watch: {
    calList() {
      this.$nextTick(() => {
        setTimeout(() => {}, 0);
      });
    },
    show(val) {
      //一天的毫秒数

      if (val) {
        if (this.isMultiple && !this.defaultEndDate && !this.defaultEndDate) {
          console.log("我的显示状态", this.defaultEndDate, this.defaultEndDate);
          this.startDate = this.defaultStartDate;
          this.endDate = this.defaultEndDate;
          this.chooseTime.startDate = this.defaultStartDate;
          this.chooseTime.endDate = this.defaultEndDate;
          this._clearStatus();
        }
        this.createTime();
        this.goToRightPosition();
      }
    }
  },
  computed: {
    chooseTime: {
      get() {
        if (this.isMultiple) return this.multipleDate;
        if (!this.isMultiple) return this.utils.dealDate(this.today);
      },
      set(val) {
        this.today = val;
      }
    },
    wrapperStyle() {
      return `height: ${this.screenHeight}px; z-index: ${this.zIndex}`;
    },
    mainStyle() {
      return `height: 90%`;
    }
  },
  updated() {},
  created() {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
  },
  mounted() {
    this.editDate();
    //一天的毫秒数 month
    console.log("贡献者:tumingdong @1.1.3");
    this.screenHeight = window.screen.height;
    this.date = new Date();
    if (this.isMultiple) {
      //多选
      const oneDayTime = 24 * 60 * 60 * 1000;
      let onlyDate = new Date();
      onlyDate.setDate(onlyDate.getDate() + 1);
      this.multipleDate.startDate = this.defaultStartDate
        ? this.defaultStartDate
        : this.utils.dealDate(new Date());
      this.multipleDate.endDate = this.defaultEndDate
        ? this.defaultEndDate
        : this.utils.dealDate(onlyDate);
      this.defaultStartDate &&
        (this.startDate = new Date(this.defaultStartDate));
      this.defaultEndDate && (this.endDate = new Date(this.defaultEndDate));
      // this._setStatus(month, day, this.startText);
    } else {
      this.startDate = this.defaultStartDate
        ? new Date(this.defaultStartDate)
        : "";
    }
    this.$nextTick(() => {
      this._calcDate();
    });
  },
  methods: {
    createTime() {
      //创建一个时间
      const nowY = new Date().getFullYear() + 1;
      const startY = nowY - 70;
      let yearList = [];
      for (let i = startY; i < nowY; i++) {
        const obj = {};
        obj.isExit = false;
        obj.year = i;
        yearList.push(obj);
      }
      this.yearList = yearList;
    },
    goToRightPosition() {
      this.$nextTick(() => {
        if (document.querySelector(".order")) {
          setTimeout(() => {
            console.log("内层定位");
            const height = document.querySelector(".order").offsetTop;
            document.querySelector(".cm-main").scrollTop = height - 195;
          }, 0);
        } else {
          setTimeout(() => {
            const index = this.isFuture
              ? 0
              : document.getElementsByClassName("cm-month").length - 1;
            const height = document.getElementsByClassName("cm-month")[index]
              .offsetTop;
            document.querySelector(".cm-main").scrollTop = height;
          }, 0);
        }
      });
    },
    onConfirm() {
      this.hideDate();
    },
    // 选择日期
    selectDate(month, day) {
      console.log("选择的时间", month, day, `${month.month}/${day.num}`);
      if (day.type === "past") {
        return "";
      }
      this.dayGap = 0;
      if (!this.isMultiple) {
        //只允许单选的情况
        console.log("单选开始", this.startDate);
        if (!this.startDate) {
          //如果不存在开始时间
          this.startDate = new Date(`${month.month}/${day.num}`);
          // this._clearStatus()
          this.chooseTime = `${month.month}/${day.num}`.replace(/\//g, "-");
          this._setStatus(month, day, this.startText);
          this.$emit("setStartDate", this.startDate);
          this.onSure();
        } else if (
          //选中时间小于开始时间 或者 开始时间和结束时间同时存在
          new Date(`${month.month}/${day.num}`).getTime() >
            this.startDate.getTime() ||
          this.startDate
        ) {
          this.startDate = new Date(`${month.month}/${day.num}`);
          this.endDate = null;
          this.chooseTime = `${month.month}/${day.num}`.replace(/\//g, "-");
          this._clearStatus();
          this._setStatus(month, day, this.startText);
          this.$emit("setStartDate", this.startDate);
          this.onSure();
        } else if (
          //存在开始时间，不存结束时间，且选中时间不等于开始时间
          this.startDate &&
          this.startDate.getTime() !==
            new Date(`${month.month}/${day.num}`).getTime()
        ) {
          this.startDate = new Date(`${month.month}/${day.num}`);
          this.endDate = null;
          this._clearStatus();
          this._setStatus(month, day, this.endText);
          this.onSure();
        }

        return;
      }
      if (!this.startDate) {
        //如果不存在开始时间

        this.startDate = new Date(`${month.month}/${day.num}`);
        // this._clearStatus()
        this._setStatus(month, day, this.startText);

        this.$emit("setStartDate", this.startDate);
      } else if (
        //选中时间小于开始时间 或者 开始时间和结束时间同时存在
        new Date(`${month.month}/${day.num}`).getTime() <
          this.startDate.getTime() ||
        (this.startDate && this.endDate)
      ) {
        this._clearStatus();
        this.startDate = new Date(`${month.month}/${day.num}`);

        this.endDate = null;
        this._setStatus(month, day, this.startText);
        this.$emit("setStartDate", this.startDate);
      } else if (
        //存在开始时间，不存结束时间，且选中时间不等于开始时间
        this.startDate &&
        !this.endDate &&
        this.startDate.getTime() !==
          new Date(`${month.month}/${day.num}`).getTime()
      ) {
        this.endDate = new Date(`${month.month}/${day.num}`);
        this._setStatus(month, day, this.endText);
        this.$emit("setEndDate", this.endDate);

        this.dayGap =
          (this.endDate.getTime() - this.startDate.getTime()) /
            1000 /
            3600 /
            24 +
          "";
        this.multipleDate = {
          startDate: this.utils.dealDate(this.startDate),
          endDate: this.endDate ? this.utils.dealDate(this.endDate) : null
        };
        this.onSure();
      } else if (
        //存在开始时间，不存结束时间，且选中时间等于开始时间
        this.startDate &&
        !this.endDate &&
        this.startDate.getTime() ===
          new Date(`${month.month}/${day.num}`).getTime()
      ) {
        this.endDate = new Date(`${month.month}/${day.num}`);
        this._setStatus(month, day, this.endText);
        this.multipleDate = {
          startDate: this.utils.dealDate(this.startDate),
          endDate: this.endDate ? this.utils.dealDate(this.endDate) : null
        };
        this.onSure();
      }

      this.multipleDate = {
        startDate: this.utils.dealDate(this.startDate),
        endDate: this.endDate ? this.utils.dealDate(this.endDate) : null
      };
      this.$emit("change", this.startDate, this.endDate, this.dayGap);
    },
    onSure() {
      //直接关

      if (this.isMultiple) {
        setTimeout(() => {
          this.$emit("confirm", this.chooseTime);
          this.hideDate();
        }, 500);
      } else {
        setTimeout(() => {
          this.$emit("confirm", {
            startDate: this.chooseTime
          });
          this.hideDate();
        }, 500);
      }
    },

    getDateFormat(date) {
      return dateFtt("yyyy年MM月", new Date(date + "/1"));
    },
    editDate() {
      this.show = true;
      this.$emit("toHandleDate", true);
      this.zIndex = 10000;

      this.$nextTick(() => {
        this._getCalHeight();
        this.bindScroll();
        if (this.startDate instanceof Date) {
          this._setStatus(
            {
              month: `${this.startDate.getFullYear()}/${this.startDate.getMonth() +
                1}`
            },
            {
              num: `${this.startDate.getDate()}`
            },
            this.startText
          );
          this.isMultiple &&
            this._setStatus(
              {
                month: `${this.endDate.getFullYear()}/${this.endDate.getMonth() +
                  1}`
              },
              {
                num: `${this.endDate.getDate()}`
              },
              this.endText
            );
        }
      });
    },
    hideDate() {
      this.show = false;
      this.$emit("toHandleDate", false);
      this.zIndex = -1;

      this.$emit("close");
    },
    bindScroll() {
      return;
      document
        .getElementsByClassName("cm-main")[0]
        .addEventListener("scroll", this._handleScroll);
    },
    _handleScroll(e) {
      let scrollTop = e.target.scrollTop || e.srcElement.scrollTop;
      let monthHeader = Array.from(
        document.getElementsByClassName("cmm-header")
      );
      let baseHeight = document.getElementsByClassName("cmm-header")[0]
        .offsetTop;
      let animateHeight =
        document.getElementsByClassName("cmm-header")[0].offsetTop +
        document.getElementsByClassName("cm-fix")[0].clientHeight;
      try {
        monthHeader.forEach((el, i) => {
          if (
            el.offsetTop - scrollTop < baseHeight &&
            el.parentElement.offsetTop +
              el.parentElement.clientHeight -
              scrollTop >
              baseHeight
          ) {
            document.getElementsByClassName(
              "cm-fix"
            )[0].style.transform = `translateY(0px)`;
            this.fixMonth = el.textContent;
            //滑动到二月的时候自动计算前一年的日历数据，并且进行拼接
            // const curMonth = parseInt(el.textContent.slice(-3, -1));
            // const curYear = parseInt(el.textContent.slice(0, 4));
            // const xindex = this.yearList.findIndex(
            //   oitem => curYear == oitem.year
            // );
            // if (xindex != -1 && !this.yearList[xindex].isExit) {
            //   //还没有请求过
            //   const list = this._calc(curYear - 1, 12, curYear);
            //   this.calList = this.calList.concat(list);
            //   this.yearList[xindex].isExit = true;
            // }
          } else if (
            el.offsetTop - scrollTop > baseHeight &&
            el.offsetTop - scrollTop < animateHeight
          ) {
            let translate = el.offsetTop - scrollTop - animateHeight;
            if (translate < 0) {
              document.getElementsByClassName(
                "cm-fix"
              )[0].style.transform = `translateY(${translate}px)`;
            } else {
              document.getElementsByClassName(
                "cm-fix"
              )[0].style.transform = `translateY(0px)`;
            }
          }
        });
      } catch (e) {
        if (e.message !== "EndIterative") {
          throw e;
        }
        return "";
      }
    },
    _calcDate(cYear) {
      // 获取当前年份
      let currentYear = cYear || this.date.getFullYear();
      let currentMonth;

      // if (!this.isFuture) {
      //   currentMonth = cYear ? 1 : this.date.getMonth() - 2;
      // } else {
      //   currentMonth = cYear ? 1 : this.date.getMonth() + 2;
      // }
      currentMonth = this.date.getMonth() + 1;

      this.fixMonth = dateFtt(
        "yyyy年MM月",
        new Date(`${currentYear}/${currentMonth}/1`)
      );
      this.calList.length = 0;
      let nowYear = this.date.getFullYear() + 1;
      currentYear = this.isFuture ? currentYear - 1 : currentYear - 1;
      nowYear = this.isFuture ? nowYear + 1 : nowYear;
      this.calList = this._calc(currentYear, currentMonth, nowYear);
      this.goToRightPosition();
      this._getHoliday();
    },
    _calc(y, m = 12, nowYear) {
      console.log("计算时间开始-结束", y, nowYear);
      //创建日历数据
      let max = m + 4;
      let year = y;
      let month = m;
      // const nowYear = new Date().getFullYear() + 1;
      let list = [];
      const nowYearMonth = new Date().getMonth() + 1;

      for (let k = y; k < nowYear; k++) {
        if (k === new Date().getFullYear()) {
          month = new Date().getMonth() + 1;
        }
        const startM = k === y ? nowYearMonth : 1;
        for (let i = startM; i < month + 1; i++) {
          // if (i > 12) {
          //   month = i - 12;
          //   year = y + 1;
          // } else {
          //   month = i;
          // }
          const curM = i;
          let firstDay = new Date(`${year}/${curM}/1`);
          let week = firstDay.getDay();
          let obj = {
            month: `${k}/${curM}`,
            days: []
          };
          for (let times = 0; times < week; times++) {
            obj.days.push({
              num: ""
            });
          }
          let daysCount = this._getDaysCount(year, month);
          for (let times = 1; times <= daysCount; times++) {
            obj.days.push({
              num: times,
              type: "",
              price: (300 + Math.random() * 100).toFixed(0),
              status: "",
              contain: ""
            });
          }

          list.push(obj);
          // this.calList.push(obj);
          //定位默认选中日期所在的位置

          // obj.days.forEach((el) => {
          //   if (el.num) {
          //     let time = dateFtt('yyyyMMdd', new Date(`${year}/${month}/${el.num}`))
          //     getHoliday(time).then((res) => {
          //       el.type = res.data === 0 ? 'normal' : res.data === 3 ? 'weekend' : 'holiday'
          //     })
          //   }
          // })
        }
      }
      return list;
    },
    // 获取每月的总天数
    _getDaysCount(year, month) {
      let days;

      // 当月份为二月时，根据闰年还是非闰年判断天数
      if (month === 2) {
        // days= year % 4 === 0 ? 29 : 28;
        let cond1 = year % 4 === 0; // 条件1：年份必须要能被4整除
        let cond2 = year % 100 !== 0; // 条件2：年份不能是整百数
        let cond3 = year % 400 === 0; // 条件3：年份是400的倍数
        // 当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        // 如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        // 所以得出判断闰年的表达式：
        let cond = (cond1 && cond2) || cond3;
        if (cond) {
          // alert(year + "是闰年")
          // return true
          days = 29;
        } else {
          // alert(year + "不是闰年")
          // return false
          days = 28;
        }
      } else if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31;
      } else {
        // 其他月份，天数为：30.
        days = 30;
      }
      return days;
    },
    _getHoliday() {
      this.calList.forEach(el => {
        el.days.forEach(e => {
          if (!this.isFuture) {
            if (
              new Date(`${el.month}/${e.num}`).getTime() >
              new Date(
                `${this.date.getFullYear()}/${this.date.getMonth() +
                  1}/${this.date.getDate()}`
              ).getTime()
            ) {
              e.type = "past";
            }
          } else {
            if (
              new Date(`${el.month}/${e.num}`).getTime() <
              new Date(
                `${this.date.getFullYear()}/${this.date.getMonth() +
                  1}/${this.date.getDate()}`
              ).getTime()
            ) {
              e.type = "past";
            }
          }

          if (e.num && !e.type) {
            let time = dateFtt("yyyyMMdd", new Date(`${el.month}/${e.num}`));
            this.$emit("getHoliday", time, e);
          }
        });
      });
    },
    _getCalHeight() {
      document.getElementsByClassName("cm-main")[0].style.height =
        document.getElementsByClassName("cal-main")[0].clientHeight -
        document.getElementsByClassName("cm-header")[0].clientHeight -
        document.getElementsByClassName("cm-days")[0].clientHeight +
        "px";
    },
    _setStatus(month, day, status) {
      // if (this.defaultEndDate && this.defaultStartDate) {
      //   month = { month: month };
      //   day = { num: parseInt(day) };
      // }
      this.calList.forEach(el => {
        el.days.forEach(e => {
          e.contain = "";
          if (e.status === status) {
            e.status = "";
          }
          if (
            //存在开始时间、结束时间，时间小于结束时间给予contain属性
            this.startDate &&
            this.endDate &&
            new Date(this.startDate).getTime() <
              new Date(`${el.month}/${e.num}`).getTime() &&
            new Date(`${el.month}/${e.num} 08:00:00`).getTime() <
              new Date(this.endDate).getTime()
          ) {
            e.contain = "contain";
          }
          if (el.month === month.month && e.num === +day.num) {
            //选中月存在于当前数据中
            e.status = status;
          }
        });
      });
      // day.status = status
    },
    _clearStatus() {
      this.calList.forEach(el => {
        el.days.forEach(e => {
          e.status = "";
          e.contain = "";
        });
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './mixin';

.iconfont_1 {
  font-size: 16px !important;
  color: #000 !important;
}

.cal-trigger {
  flex(row, center, space-between);
  // padding: 0 15px
  height: 30px;
  padding: 5px 15px;

  .cal-result {
    flex(row, center, space-around);

    .date-time {
      font-size: 14px;
    }

    .date-days {
      font-size: 12px;
      color: rgba(153, 153, 153, 0.7);
    }

    .blank {
      margin: 0 12px;
    }
  }

  .cal-total {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
  }
}

.cal-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  overflow: hidden;
}

.cal-mask {
  height: 10%;
}

.cal-wrapper {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);

  .cal-main {
    background-color: #fff;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    position: relative;

    .cm-header {
      text-align: center;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      position: relative;
      background-color: #fff;

      .close-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);

        span {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .cm-days {
      height: 30px;
      flex(row, center, space-around);
      position: relative;
      background-color: #fff;

      .cm-days-item {
        font-size: 12px;

        &.holiday {
          color: #D70D19;
        }
      }
    }

    .cm-fix {
      position: absolute;
      z-index: 5;
      top: 65px;
      left: 0;
      text-align: center;
      height: 30px;
      line-height: 30px;
      // border-bottom: 1px solid #dedede
      // border-top: 1px solid #efefef
      background-color: #fff;
      width: 100%;
      font-size: 14px;
    }

    .cm-main {
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .cm-month {
        .cmm-header {
          text-align: center;
          font-size: 14px;
          height: 30px;
          line-height: 30px;
        }

        .cmm-main {
          flex(row, center, flex-start);
          flex-wrap: wrap;

          .day-item {
            width: 14.285714%;
            height: 50px;
            // line-height: 110px
            text-align: center;
            flex(column, center, center);

            .info {
              &.num {
                height: 20px;
                line-height: 20px;
                font-size: 14px;

                &.holiday, &.weekend {
                  color: #D70D19;
                }

                &.past {
                  color: rgba(0, 0, 0, 0.5);
                }
              }

              &.price {
                font-size: 12px;
              }

              &.tag {
                font-size: 12px;
              }
            }

            &.order {
              background-color: #ffb403;
              color: #fff;

              .num {
                &.holiday, &.weekend {
                  color: #fff;
                }
              }
            }

            &.contain {
              background-color: #f8e0a7;
              color: #fff;

              .num {
                &.holiday, &.weekend {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(0, 100%, 0);
}

.cm-month:last-child {
  padding-bottom: 100px;
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .cm-month:last-child {
    padding-bottom: 100px;
  }
}

@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  .cm-month:last-child {
    padding-bottom: 100px;
  }
}

@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .cm-month:last-child {
    padding-bottom: 100px;
  }
}

@media only screen and (device-width: 414px) and (device-height: 919px) and (-webkit-device-pixel-ratio: 3) {
  .cm-month:last-child {
    padding-bottom: 100px;
  }
}
</style>
