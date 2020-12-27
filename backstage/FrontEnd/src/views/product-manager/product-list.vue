<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.productId" :placeholder="$t('productManager.productId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.productName" :placeholder="$t('productManager.productName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('productManager.productId')" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('productManager.productName')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('productManager.productPrice')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productPrice }}元</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('productManager.oneRatio')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.oneRatio }}%</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('productManager.twoRatio')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.twoRatio }}%</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.updateTime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="orderTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('productManager.productName')" prop="title">
          <el-input v-model="orderTemp.productName" />
        </el-form-item>
        <el-form-item :label="$t('productManager.productPrice')" prop="title">
        <el-input v-model="orderTemp.productPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item :label="$t('productManager.oneRatio')" prop="title">
        <el-input v-model="orderTemp.oneRatio" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item :label="$t('productManager.twoRatio')" prop="title">
        <el-input v-model="orderTemp.twoRatio" placeholder="请输入价格" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, addProduct,removeProduct,editProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getListData } from './testData'
import { packageOrderDetailsData ,getProductStruct, packageProductData} from './config'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {},
      orderTemp: {
        userName: undefined,
        number: undefined,
        productName:undefined,
        dialogRemark: '备注',
        timestamp: new Date()
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        userName: [{ required: true, message: 'userName is required', trigger: 'change' }],
        money: [{ required: true, message: 'money is required', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.listQuery = getProductStruct();
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProductList(this.listQuery).then(response => {
        var recv_data = response.data;
        this.list = packageProductData(recv_data.list);
        this.total =  recv_data.count;
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.orderTemp = Object.assign({}, getProductStruct()) // copy obj
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.orderTemp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.orderTemp.author = 'vue-element-admin'
          addProduct(this.orderTemp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.orderTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.orderTemp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editProduct(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.orderTemp.id)
            this.list.splice(index, 1, this.orderTemp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      var temp = Object.assign({}, row) // copy obj
      removeProduct(temp).then(response => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })  
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
