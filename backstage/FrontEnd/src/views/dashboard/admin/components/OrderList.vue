<template>
  <div>  
      <el-table :data="list" style="width: 100%;padding-top: 15px;">
        <el-table-column label="订单ID" min-width="50">
          <template slot-scope="{row}">
            {{ row.orderId }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" width="150" align="center">
          <template slot-scope="{row}">
            {{ row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="消费金额" width="150" align="center">
          <template slot-scope="{row}">
              {{ row.money }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200" align="center">
          <template slot-scope="{row}">
              {{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button plain align="center" style="width: 100%;padding-top: 15px;" @click="moreBtnClick" >查看更多</el-button>
      </el-row>
  </div>
</template>

<script>
import { transactionList } from '@/api/remote-search'
import { packageOrderDetailsData ,packageUserInfoData} from '../../../user-information/config'
import { getOrderList, getUserList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      getOrderList({
        page: 1,
        limit: 6,
      }).then(response => {
          var recv_data = response.data;
          this.list = packageOrderDetailsData(recv_data.list);
          this.total =  recv_data.totalCount;
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
      })
    },
    moreBtnClick(){
      this.$router.push({ path: '/user-information/order-list'})
    },
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
