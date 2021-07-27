<template>
  <div>
    <div class="hot-input">
      <div class="block">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-input"
        >
        </el-date-picker>
      </div>
      <el-input
        placeholder="请输入内容（可以为空）"
        prefix-icon="el-icon-search"
        v-model="content"
        class="content-input"
      >
      </el-input>
      <el-button type="primary" @click="getPastHotSearch">热搜查询</el-button>
    </div>
    <el-table
      :data="currentHotData"
      style="width: 100%"
      empty-text="数据加载中，请稍等"
    >
      <el-table-column prop="rank" label="排行" width="240"> </el-table-column>
      <el-table-column prop="name" label="热搜名" width="300">
      </el-table-column>
      <el-table-column prop="url" label="热搜地址" width="500"></el-table-column>
      <el-table-column prop="count" label="热度值" width="200"> </el-table-column>
       <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="$router.push({
        name: 'pasthotarticle',
        params: {
          url: `${scope.row.url.replace('https://s.weibo.com/','')}`,
          name:`${scope.row.name}`
        }
      })"
 type="text" size="small">相关文章分析</el-button>
        <el-button type="text" size="small" @click="$router.push({
        name: 'pasthotmap',
        params: {
          name:`${scope.row.name}`
        }
      })">热度变化图表</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      currentHotData: [],
      content: "",
      date: "",
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
    },
    async getPastHotSearch() {
      this.currentHotData = [];
      const res = await this.$http.get(
        "getPastHotSearch",
        { params: { date: this.date, content: this.content } },
        {
          emulateJSON: true,
        }
      );
      console.log(res.data);
      this.currentHotData = res.data;
    },
  },
  created() {
    this.getCurrentHotData();
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
</style>