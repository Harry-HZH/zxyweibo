<template>
  <div class="EchartPractice">
    <div id="main"></div>
  </div>
</template>


<script>
import * as dayjs from "dayjs";

export default {
  props: {
    name: String,
  },
  data() {
    return {
      pastHotMapData: [],
      dateList: [],
      dateX: [],
      valueList: [],
      arr: [],
    };
  },
  methods: {
    async getPastHotMapData() {
      const res = await this.$http.post(
        "getPastHotMapData",
        this.$route.params
      );
      for (let item of res.data) {
        if (!item.count) {
          item.count = "可能为微博广告";
          return this.$message({
            message: "此热搜为微博广告，无法查询热度，请返回",
            type: "warning",
          });
        }
        if (item.count == 0) {
          item.count = "微博置顶热搜";
          return this.$message({
            message: "此热搜为微博手动置顶热搜，无法查询热度，请返回",
            type: "warning",
          });
        }
        item.created_at = dayjs(item.created_at).format();
      }

      this.pastHotMapData = res.data;
      this.pastHotMapData.map((el) => {
        this.dateList.push(el.created_at);
        this.valueList.push(el.count);
        this.dateX.push(dayjs(el.created_at).format("YY年M月D日 H时"));
        return;
      });
      this.drawChart();
    },
    drawChart() {
      let myEchart = this.$echarts.init(document.getElementById("main"));
      let option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: "continuous",
            dimension: 0,
            min: 0,
            max: this.dateList.length - 1,
          },
        ],
        title: {
          top: "0%",
          left: "center",
          text: this.pastHotMapData[0].name,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          data: this.dateX,
        },
        yAxis: {},
        grid: {
          top: "15%",
        },
        series: {
          type: "line",
          showSymbol: false,
          data: this.valueList,
        },
      };
      option && myEchart.setOption(option);
    },
  },
  mounted() {
    this.getPastHotMapData();
  },
};
</script>

<style>
#main {
  width: 1000px;
  height: 700px;
  margin: auto;
  margin-top: 100px;
}
</style>