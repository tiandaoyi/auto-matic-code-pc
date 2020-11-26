<template>
  <div class="hello" style="margin:10px 30px;" v-loading="loading">
    <h4>
      可拖动代码生成器（基于ele-list-page组件生成前端代码）
      <a style="font-size: 14px;" target="_blank" href="https://www.npmjs.com/package/ele-list-page">ele-list-page列表页组件：npm地址</a>
      <i style="font-size: 14px;"> - </i>
      <a style="font-size: 14px;" target="_blank" href="https://github.com/tiandaoyi/ele-list-page">github地址</a>
    </h4>

    <div class="row">
      <div class="col-8" style="border: 1px solid #113458; border-style: dotted;">
        <v-flex
          v-for="(row, index) in rows"
          :key="index"
          class="sortable"
          xs12
          my-2
        >
          <svg class="svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="7.451171875" height="7.451171875" patternUnits="userSpaceOnUse"><path d="M 7.451171875 0 L 0 0 0 7.451171875" fill="none" stroke="rgba(207, 207, 207, 0.3)" stroke-width="1"></path></pattern><pattern id="grid" width="37.255859375" height="37.255859375" patternUnits="userSpaceOnUse"><rect width="37.255859375" height="37.255859375" fill="url(#smallGrid)"></rect><path d="M 37.255859375 0 L 0 0 0 37.255859375" fill="none" stroke="rgba(186, 186, 186, 0.5)" stroke-width="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"></rect></svg>
          <div class="content-title">
            {{ row.areaText }}：
          </div>
          
          <draggable
            v-if="index === 0"
            :list="row.items"
            tag="v-layout"
            :group="{ name: 'row' }"
            class="row wrap justify-space-around"
          >
            <v-flex
              v-for="(item, itemIndex) in row.items"
              :key="itemIndex"
              xs3
              pa-3
              class="row-v"
              style="padding: 10px;"
            >
              <v-card style="padding: 8px">
                <div>显示名称: <span style="color: #005ab7">{{ item.title }}</span></div>
                <div>显示字段: <span style="color: #005ab7">{{ item.field }}</span></div>
                <div>显示类型: <span style="color: #005ab7">{{ item.typeText }}</span></div>
                <el-button type="danger" size="mini" @click="row.items.splice(itemIndex, 1)">删除</el-button>
              </v-card>
            </v-flex>
          </draggable>
          <draggable
            v-if="index === 1"
            :list="row.items"
            tag="v-layout"
            :group="{ name: 'row' }"
            class="row wrap justify-space-around"
          >
            <template v-if="index === 1">
              <v-flex
                v-for="(item, itemIndex) in row.items"
                :key="itemIndex"
                xs3
                pa-3
                class="row-v"
                style="padding: 10px;"
              >
                <v-card style="padding: 8px">
                  <div>显示名称(枚举): <span style="color: #005ab7">{{ item && item.title ? item.title : ''}}</span></div>
                  <div>显示位置: <span style="color: #005ab7">{{ item && item.field ? '左(上)' : '右(下)' }}</span></div>
                  <el-button type="danger" size="mini" @click="row.items.splice(itemIndex, 1)">删除</el-button>
                </v-card>
              </v-flex>
            </template>
          </draggable>
          <draggable
            :list="row.items"
            v-if="index === 2"
            tag="v-layout"
            :group="{ name: 'row' }"
            class="row wrap justify-space-around"
          > 
            <template v-if="index === 2">
              <v-flex
                v-for="(item, itemIndex) in row.items"
                :key="itemIndex"
                xs3
                pa-3
                class="row-v"
                style="padding: 10px;"
              >
                <v-card style="padding: 8px;">
                  <div>显示名称: <span style="color: #005ab7">{{ item.title }}</span></div>
                  <div>显示字段: <span style="color: #005ab7">{{ item.field }}</span></div>
                  <el-button type="danger" size="mini" @click="row.items.splice(itemIndex, 1)">删除</el-button>
                </v-card>
              </v-flex>
            </template>
          </draggable>
        </v-flex>
      </div>
      <div class="col-4" style="border: 1px solid #113458;border-style: dotted;border-left: none;">
        <div  class="col-4-child">
          <div>1. 添加列表搜索项</div>
          <el-form ref="formSearch" :model="formSearch" label-width="150px">
            <el-form-item label="请输入后端字段">
              <el-input v-model="formSearch.title" placeholder="请输入后端字段"></el-input>
            </el-form-item>
            <el-form-item label="请输入显示的值">
              <el-input v-model="formSearch.field" placeholder="请输入显示的值"></el-input>
            </el-form-item>
            <el-form-item label="请选择筛选条件类型">
              <el-select v-model="formSearch.type" placeholder="请选择筛选条件类型">
                <el-option
                  v-for="item in searchType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="onAddSearchClick(formSearch)">添加搜索项</el-button>
          </el-form>
        </div>

        <div class="col-4-child">
          <div>2. 添加中间按钮
            <span style="font-size: 14px;color: red;">（名称或枚举推荐使用add，invalid，valid，export，search，clear有预设样式， 自定义列按钮必须为customColumns）</span>
          </div>
          <el-form ref="formFilter" :model="formFilter" label-width="120px">
            <el-form-item label="名称或枚举">
              <el-input v-model="formFilter.title" placeholder="请输入按钮名称或者替代枚举"></el-input>
            </el-form-item>
            <el-form-item label="是否左边或上边">
              <el-switch v-model="formFilter.field" placeholder="是否左边或上边">
              </el-switch>
            </el-form-item>
            <el-button type="primary" @click="onAddFilterClick(formFilter)">添加中间按钮</el-button>
          </el-form>
        </div>

        <div  class="col-4-child">
          <div>3. 添加列

            <span style="font-size: 14px;color: red;">(如果开启自定义列不需要添加)</span>
          </div>
          <el-form ref="formTable" :model="formTable" label-width="150px">
            <el-form-item label="列内容">
              <el-input v-model="formTable.title" placeholder="列内容"></el-input>
            </el-form-item>
            <el-form-item label="列字段">
              <el-input v-model="formTable.field" placeholder="列字段">
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="onAddTableClick(formTable)">添加列</el-button>
          </el-form>
        </div>

        <div class="col-4-child">
          <div>4. 基本配置</div>
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="文件名称">
              <el-input v-model="form.fileName" placeholder="例：list.vue"></el-input>
            </el-form-item>
            <el-form-item label="是否显示自定义列">
              <el-switch v-model="form.isCustomCol" placeholder="是否自定义列">
              </el-switch>
            </el-form-item>
            <el-form-item label="列表是否显示复选框">
              <el-switch v-model="form.isShowCheckBox" placeholder="表格是否固高">
              </el-switch>
            </el-form-item>
            <el-form-item label="列表是否显示序号列">
              <el-switch v-model="form.isShowOrder" placeholder="表格是否固高">
              </el-switch>
            </el-form-item>
            <el-form-item label="列表是否显示操作列">
              <el-switch v-model="form.isShowHandle" placeholder="列表是否显示操作列">
              </el-switch>
            </el-form-item>
            <el-form-item label="表格是否固高">
              <el-switch v-model="form.isFixTableHeight" placeholder="表格是否固高">
              </el-switch>
            </el-form-item>
            <el-form-item label="table固定高度" v-if="form.isFixTableHeight">
              <el-input v-model.number="form.tableHeight" placeholder="默认固定200"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button @click="onSaveFile" type="success" style="width: 100%;box-shadow: 2px 4px 5px 0px #0000008c;" round size="large"  >生成页面</el-button>
      </div>

      <rawDisplayer class="col-12" style="font-size: 10px;" :value="rows" title="List" />
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
// import { saveAs } from 'file-saver';
Vue.use(Vuetify);
export default {
  name: "functional",
  display: "Functional third party",
  order: 17,
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      FileSaver: require('file-saver'),
      // 文件区域
      form: {
        fileName: '',
        isCustomCol: true,
        isShowCheckBox: true,
        isShowOrder: true,
        isShowHandle: true,
        isFixTableHeight: false,
        tableHeight: null
      },
      formSearch: {
        title: null,
        field: null,
        type: null
      },
      formFilter: {
        title: null,
        field: null,
        type: null
      },
      formTable: {
        title: null,
        field: null,
        type: null
      },
      customList: [{
        value: true,
        label: '开启自定义列'
      },{
        value: false,
        label: '关闭自定义列'
      }],
      searchType: [{
        value: 1,
        label: '输入框'
      },{
        value: 2,
        label: '下拉框'
      },{
        value: 3,
        label: '日期选择器'
      },{
        value: 4,
        label: '单选框'
      },{
        value: 5,
        label: '级联选择'
      }],
      rows: [
        {
          index: 1,
          areaText: '搜索区域',
          items: [
            {
              title: "商品编号",
              field: 'itemCode',
              typeText: '文本',
              type: null
            }
          ]
        },
        {
          index: 2,
          areaText: '按钮组',
          items: [
            {
              title: "添加",
              field: false,
              // typeText: '文本',
              // type: null,
            },
          ]
        },
        {
          index: 3,
          areaText: '显示列',
          items: [
            {
              title: "商品编号",
              field: 'itemCode',
              // typeText: '文本',
              // type: null
            },
          ]
        }
      ]
    };
  },
  methods: {
    onSaveFile() {
      this.loading = true
      this.axios({
        url: '/api/getPCPage', 
        method: 'post',
        data: {
          rows: this.rows,
          basicInfo: this.form
        }, 
        responseType: 'blob'
      }).then(({data}) => {
        if (data) {
          const blob = new Blob([data], {type: "text/plain;charset=utf-8"})
          this.FileSaver.saveAs(blob, 'list.vue')
        }
      }).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 300)
      })
    },
    onAddSearchClick(form) {
      if (!form.title || !form.field || !form.type) {
        alert('输入不完整')
      } else {
        this.rows[0].items.push({
          title: form.title,
          field: form.field,
          typeText: this.searchType.find(item => item.value === form.type).label,
          type: form.type,
        })
      }
    },
    onAddFilterClick(form) {
      if (!form.title) {
        alert('输入不完整')
      } else {
        this.rows[1].items.push({
          title: form.title,
          field: form.field,
          typeText: null,
          type: null,
        })
        console.log(this.rows[1])
      }
    },
    onAddTableClick(formSearch) {
      if (!formSearch.field || !formSearch.title) {
        alert('输入不完整')
      } else {
        this.rows[2].items.push({
          title: formSearch.title,
          field: formSearch.field,
        })
      }
    }
  }
};
</script>
<style scoped>
  .col-4-child {
    margin-bottom: 10px;
    border: 1px solid #d0d0d0;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 3px 2px 5px 1px #97b6c5;
    padding: 6px;
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }

  .hello ::v-deep .el-input--small .el-input__inner {
    line-height: 28px;
    height: 28px;
  }

  .svg {
    overflow: hidden;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  .content-title {
    color: #000000;
    /* font-weight: bold; */
    font-size: 20px;
  }

  .sortable {
    position: relative;
    border: 1px solid #bfbfbf;
    box-shadow: 4px 3px 3px 2px #e2e2e2;
    border-radius: 5px;
    margin-bottom: 20px!important;
  }
</style>
