<template>
  <div class="hello" style="margin:30px;">
    <div class="row">
      <div class="col-8">
        <h3>自动生成PC端列表页（前端代码）（可拖动更改位置）</h3>
        <draggable
          v-model="rows"
          tag="v-layout"
          class="row wrap align-center sortable-list"
          style="background: grey;"
        >
          <v-flex
            v-for="(row, index) in rows"
            :key="index"
            class="sortable"
            xs12
            my-2
            style="background: gray"
          >
            <div style="color: white;">
              {{ row.areaText }}
            </div>
            
            <draggable
              :list="row.items"
              tag="v-layout"
              :group="{ name: 'row' }"
              class="row wrap justify-space-around"
            >
              <template v-if="index === 0">
                <v-flex
                  v-for="(item, itemIndex) in row.items"
                  :key="itemIndex"
                  xs3
                  pa-3
                  class="row-v"
                  style="padding: 10px;"
                >
                  <v-card style="height: 120px;">
                    <div>显示名称: <span style="color: red">{{ item.title }}</span></div>
                    <div>显示字段: <span style="color: red">{{ item.field }}</span></div>
                    <div>显示类型: <span style="color: red">{{ item.typeText }}</span></div>
                    <el-button type="danger" @click="row.items.splice(itemIndex, 1)">删除</el-button>
                  </v-card>
                </v-flex>
              </template>
              <template v-if="index === 1">
                <v-flex
                  v-for="item in row.items"
                  :key="item.title"
                  xs3
                  pa-3
                  class="row-v"
                  style="padding: 10px;"
                >
                  <v-card style="height: 100px;">
                    <div>显示名称: <span style="color: red">{{ item.title }}</span></div>
                    <div>显示字段: <span style="color: red">{{ item.field }}</span></div>
                    <div>显示类型: <span style="color: red">{{ item.typeText }}</span></div>
                    <el-button type="danger" @click="row.items.splice(itemIndex, 1)">删除</el-button>
                  </v-card>
                </v-flex>
              </template>
              <template v-if="index === 2">
                <v-flex
                  v-for="item in row.items"
                  :key="item.title"
                  xs2
                  pa-3
                  class="row-v"
                  style="padding: 10px;"
                >
                  <v-card style="height: 100px;">{{ item.title }}</v-card>
                </v-flex>
              </template>
            </draggable>
          </v-flex>
        </draggable>
      </div>
      <div class="col-2">
        <div style="margin-bottom: 20px;border: 1px solid black;padding: 5px;">
          <div>0. 文件生成基本信息选择</div>
          <el-input v-model="pageObject.featureEn" placeholder="输入生成的功能名(英文)"></el-input>
          <el-input v-model="pageObject.feature" placeholder="输入生成的功能名(中文)"></el-input>
          <span style="font-size: 12px;">代码文件所属模块:</span>
          <el-select v-model="pageObject.file" placeholder="代码文件所属模块">
            <el-option
              v-for="item in fileComponents"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </div>

        <div style="margin-bottom: 20px;border: 1px solid black;padding: 5px;">
          <div>1. 添加列表搜索项</div>
          <el-input v-model="searchObject.a" placeholder="请输入后端字段"></el-input>
          <el-input v-model="searchObject.b" placeholder="请输入显示的值"></el-input>
          <span style="font-size: 12px;">请选择筛选条件类型:</span><el-select v-model="searchObject.c" placeholder="请选择筛选条件类型">
            <el-option
              v-for="item in searchType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <br/>
          <el-button type="primary" @click="onAddSearchClick">添加搜索项</el-button>
          <br/>
          <br/>
        </div>

        <div style="margin-bottom: 20px;border: 1px solid black;padding: 5px;">
          <div>2. 选择列表页的批量操作按钮</div>
          代码写入: 
          <el-button type="primary" @click="onAddSearchClick">添加中间部位按钮</el-button>
        </div>

        <div style="margin-bottom: 20px;border: 1px solid black;padding: 5px;">
          <div>3. 列内容</div>
        </div>
      </div>

      <rawDisplayer class="col-2" style="font-size: 10px;" :value="rows" title="List" />
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
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
      // 文件区域
      pageObject: {
        featureEn: '',
        feature: '',
        file: 'management'
      },
      fileComponents: [{
        value: 'management',
        label: '商品'
      },{
        value: 'equipment',
        label: '设备'
      }],
      searchObject: {
        a: '',
        b: '',
        c: 1
      },
      searchType: [{
        value: 1,
        label: '文本'
      },{
        value: 2,
        label: '下拉框'
      },{
        value: 3,
        label: '时间选择'
      },{
        value: 4,
        label: '开窗'
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
              field: 'itemCode'
            },
          ]
        },
        {
          index: 3,
          areaText: '显示列',
          items: [
            {
              title: "商品编号",
              field: 'itemCode'
            },
          ]
        }
      ]
    };
  },
  methods: {
    onAddSearchClick() {
      console.log('1')
      const searchObject = this.searchObject
      if (!searchObject.a || !searchObject.b) {
        alert('输入不完整')
      } else {
        this.rows[0].items.push({
          title: searchObject.a,
          field: searchObject.b,
          typeText: this.searchType.find(item => item.value === searchObject.c).label,
          type: searchObject.c,
        })
      }
      
    }
  }
};
</script>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
