<template>
  <el-tabs type="border-card">
    <el-tab-pane label="用户管理">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="account" label="账号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="isLive" label="是否在线">
          <template v-slot="scope">
            <el-image style="width: 2rem" :src="scope.row.isLive"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="reLogin(scope.$index, scope.row)"
              >重新登录</el-button
            >
            <el-switch
              class="switch"
              active-text="开启数据爬取"
              inactive-text="关闭数据爬取"
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name:'account',
  data() {
    return {
      tableData: [
        {
          account: "18918102262",
          name: "贺老卵",
          isLive: require("../assets/loading.gif"),
        },
      ],
      value:false,
    };
  },

  methods: {
    async testLogin() {
      const res = await this.$http.get("testLogin");
      console.log(res.data);
      if (res.data) {
        this.tableData[0].isLive = require("../assets/勾.png");
      } else {
        this.$message.error({
          showClose: true,
          message: "请联系管理员重新登陆",
        });
        this.tableData[0].isLive = require("../assets/大叉.png");
      }
    },
    async reLogin() {
      this.tableData[0].isLive = require("../assets/loading.gif");
      const res = await this.$http.get("reLogin");
      console.log(res.data);
      if (res.data) {
        this.tableData[0].isLive = require("../assets/勾.png");
      } else {
        this.$message.error({
          showClose: true,
          message: "请联系管理员重新登陆",
        });
        this.tableData[0].isLive = require("../assets/大叉.png");
      }
    },
    async switch() {
      if(this.value === ''){
        const res = await this.$http.get("isSearch");
        this.value = res.data;
      }
      if (this.value === false) {
        const res = await this.$http.get("closeSearch");
        console.log(res.data);
      } else {
        const res = await this.$http.get("openSearch");
        console.log(res.data);
      }
    },
    async isSearch() {
      const res = await this.$http.get("isSearch");
      this.value = res.data;
      this.$watch('value',this.switch,{immediate:false})
    },
  },
  created(){
    this.isSearch();
    console.log('组件创建了');
  },
  mounted() {
    this.testLogin();
  },
  destoryed(){
    console.log('组件销毁了');
  }
};
</script>

<style>
.switch {
  margin-left: 20px;
}
</style>