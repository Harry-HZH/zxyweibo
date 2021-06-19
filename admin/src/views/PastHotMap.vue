<template>
  <div class="EchartPractice">
    <div id="main"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      currentHotData: [],
      arr: [],
    };
  },
  methods: {
    async getCurrentHotData() {
      const res = await this.$http.get("getCurrentHotData");
      for (let item of res.data) {
        if (!item.count) {
          item.count = "可能为微博广告";
        }
        if (item.count == 0) {
          item.count = "微博置顶热搜";
        }
      }
      this.currentHotData = res.data;
      // this.currentHotData.map((el) => {
      //   let newarr = [];
      //   for (let item in el) {
      //     newarr.push(el[item]);
      //   }
      //   this.arr.push(newarr)
      //   return 0;
      // });
      console.log(this.currentHotData);
      this.drawChart();
    },
    drawChart() {
      let myEchart = this.$echarts.init(document.getElementById("main"));
      let option = {
        title:{
           text: '实时微博热搜',
           x:'center',
           y: 'top', 
        },
        tooltip:{},
        dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'empty',
            start: 0,
            end: 25
        },
        {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'empty'
        }
    ],
        dataset: [
          {
            dimensions: ["count", "name", "rank", "url"],
            source: this.currentHotData,
          },
          {
            transform: {
              type: "sort",
              config: { dimension: "count", order: "desc" },
            },
          },
        ],
        xAxis: {
          type: "category",
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
          type: "bar",
          encode: { x: "name", y: "count" },
          datasetIndex: 1,
        },
      };
      option && myEchart.setOption(option);
    },
  },
  mounted() {
    this.getCurrentHotData();
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