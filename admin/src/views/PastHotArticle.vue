<template>
  <div>
    <div class="article" v-if="isShow">
      <el-button type="primary" @click="createWordCloud">生成词云图</el-button>
      <el-button type="primary" @click="1">生成分析图</el-button>
      <el-table
        :data="pastHotArticleEnd"
        style="width: 100%"
        :empty-text="emptyText"
        @sort-change="sortChange"
      >
        <el-table-column prop="nickname" label="发布者" width="300">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          width="700"
        ></el-table-column>
        <el-table-column
          prop="dianzan"
          label="点赞数"
          sortable
          width="150"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="发布时间"
          sortable
          width="240"
        ></el-table-column>
        <el-table-column
          prop="from"
          label="来自设备"
          sortable
          width="240"
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="word-cloud" v-show="!isShow">
      <el-button type="primary" @click="back">返回数据显示页</el-button>
      <div id="word"></div>
    </div>
  </div>
</template>


<script>
import "echarts-wordcloud";
export default {
  props: {
    url: String,
    name: String,
  },
  data() {
    return {
      pastHotArticleClone:[],
      pastHotArticle: [],
      pastHotArticleEnd: [],
      wordCloudArr: [],
      isShow: true,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      emptyText: "数据加载中，请稍等......",
    };
  },
  methods: {
    async getPastHotArticle() {
      if (this.$route.params) {
        const res = await this.$http.post(
          "getPastHotArticle",
          this.$route.params
        );
        console.log(res.data);
        if (res.data === "此为微博广告，无法爬取") {
          this.emptyText = res.data;
          return;
        }
        this.pastHotArticle = res.data.model;
        this.pastHotArticleClone = JSON.parse(JSON.stringify(this.pastHotArticle))
        this.total = this.pastHotArticle.length;
        if (this.total > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.pastHotArticleEnd.push(this.pastHotArticle[index]);
          }
        } else {
          this.pastHotArticleEnd = this.pastHotArticle;
        }

        this.wordCloudArr = res.data.dataArr;
      }
    },
    handleCurrentChange: function (currentPage) {
      //页码切换
      console.log("页码切换");
      this.currentPage = currentPage;
      this.currentChangePage(this.pastHotArticle, currentPage);
    },
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.pastHotArticleEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.pastHotArticleEnd.push(list[from]);
        }
      }
    },
    createWordCloud() {
      this.isShow = !this.isShow;
      this.$nextTick(() => {
        let myEchart = this.$echarts.init(document.getElementById("word"));
        let option = {
          title: {
            text: `"${this.name}"` + "词云图分析",
            x: "center",
            y: "top",
          },
          series: [
            {
              type: "wordCloud",

              // The shape of the "cloud" to draw. Can be any polar equation represented as a
              // callback function, or a keyword present. Available presents are circle (default),
              // cardioid (apple or heart shape curve, the most known polar equation), diamond (
              // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

              shape: "cardioid",

              // A silhouette image which the white area will be excluded from drawing texts.
              // The shape option will continue to apply as the shape of the cloud to grow.

              // maskImage: maskImage,

              // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
              // Default to be put in the center and has 75% x 80% size.

              left: "center",
              top: "center",
              width: "70%",
              height: "80%",
              right: null,
              bottom: null,

              // Text size range which the value in data will be mapped to.
              // Default to have minimum 12px and maximum 60px size.

              sizeRange: [9, 60],

              // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

              rotationRange: [-0, 0],
              rotationStep: 45,

              // size of the grid in pixels for marking the availability of the canvas
              // the larger the grid size, the bigger the gap between words.

              gridSize: 8,

              // set to true to allow word being draw partly outside of the canvas.
              // Allow word bigger than the size of the canvas to be drawn
              drawOutOfBound: false,

              // If perform layout animation.
              // NOTE disable it will lead to UI blocking when there is lots of words.
              layoutAnimation: true,

              // Global text style
              textStyle: {
                fontFamily: "sans-serif",
                fontWeight: "bold",
                // Color can be a callback function or a color string
                color: function () {
                  // Random color
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                focus: "self",

                textStyle: {
                  shadowBlur: 10,
                  shadowColor: "#333",
                },
              },

              // Data is an array. Each array item must have name and value property.
              data: this.wordCloudArr,
            },
          ],
        };
        option && myEchart.setOption(option);
      });
    },
    back() {
      this.isShow = !this.isShow;
      this.$nextTick();
    },
    sortChange(column) {
      this.currentPage = 1; // 排序后返回第一页
      if (column.order === "descending") {
        this.pastHotArticle.sort((a, b) => b[column.prop] - a[column.prop]);
      } else if (column.order === "ascending") {
        this.pastHotArticle.sort((a, b) => a[column.prop] - b[column.prop]);
      } else if (column.order === null){
        this.pastHotArticle = this.pastHotArticleClone
      }
      this.handleCurrentChange(this.currentPage);
    },
  },
  created() {
    this.getPastHotArticle();
  },
};
</script>

<style>
.hot-input {
  display: flex;
  margin-bottom: 30px;
}
.date-input {
  width: 300px;
}
.content-input {
  width: 300px;
  margin-left: 20px;
  margin-right: 30px;
}
#word {
  width: 1000px;
  height: 600px;
  margin: auto;
  margin-top: 100px;
}
.block .el-pagination {
  width: 20%;
  margin: 0 auto;
}
</style>