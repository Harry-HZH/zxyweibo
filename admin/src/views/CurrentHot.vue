<template>
  <el-table
    :data="currentHotData"
    style="width: 100%"
    empty-text="数据加载中，请稍等">
    <el-table-column
      prop="rank"
      label="排行"
      width="240">
    </el-table-column>
    <el-table-column
      prop="name"
      label="热搜名"
      width="700">
    </el-table-column>
    <el-table-column
      prop="count"
      label="热度值">
    </el-table-column>
  </el-table>
</template>


<script>
export default {
    data(){
        return{
            currentHotData:[]
        }
    },
    methods:{
        async getCurrentHotData(){
           const res = await this.$http.get('getCurrentHotData')
           for (let item of res.data){
               if(!item.count){
                   item.count = "可能为微博广告"
               }
               if(item.count==0){
                   item.count = "微博置顶热搜"
               }
           }
           this.currentHotData = res.data
        }
    },
    created(){
        this.getCurrentHotData()
    }
}
</script>

<style>

</style>