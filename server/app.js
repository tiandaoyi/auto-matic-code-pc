const Koa = require('koa');
const http = require('http');
const https = require('https');
const app = new Koa();

// app.listen(7211, () => {
//   console.log('[Koa] Server is starting at port 7211!');
// });
// http.createServer(app.callback()).listen(3000);

app.use(async ctx => {
  const url = ctx.request.url
  if (url !== '/getPCPage' && url !== '/api/getPCPage') {
    ctx.status = 404
    return;
  }
  const postData = await parsePostData(ctx)


  const { rows, basicInfo } = postData

  const searchTypeEnum = {
    1: 'input',
    2: 'select',
    3: 'time',
    4: 'number',
    5: 'switch',
    6: 'cascader'
  }

  // 搜索项目
  let searchData = ''
  rows[0].items.forEach((item, index) => {
    searchData += 
    `{
            name: '${item.title}',
            searchField: '${item.field}',
            searchType: '${searchTypeEnum[item.type || 1]}'
          }${(index !== rows[0].items.length - 1) ? ', ' : ''}`
  })

  // 过滤按钮
  let filterEnum = ['add','invalid','valid','export','search','clear']
  let filterDataLeft = ''
  let filterDataRight = ''
  rows[1].items.forEach((item, index) => {
    let key = filterEnum.includes(item.title) ? 'filterType' : 'name'
    let fnStr = ''
    if (item.title === 'search') {
      fnStr = 'fn: () => this.loadTableData()'
    } else if (item.title === 'clear') {
      fnStr = 'fn: () => this.searchForm = {}'
    } else {
      fnStr = 'fn: () => {}'
    }
    if (item.field) {
      filterDataLeft += 
      `{
            ${key}: '${item.title}',
            ${fnStr}
          }${(index !== rows[1].items.length - 1) ? ', ' : ''}`
    } else {
      filterDataRight += 
      `{
            ${key}: '${item.title}',
            ${fnStr}
          }${(index !== rows[1].items.length - 1) ? ', ' : ''}`
    }
  })

  // 表格数据
  let tableData = ''
  rows[2].items.forEach((item, index) => {
    tableData += 
    `{
              label: '${item.title}',
              prop: '${item.field}'
            }${(index !== rows[2].items.length - 1) ? ', ' : ''}`
  })

  ctx.body = 
`<template>
  <EleListPage
    :tableCommonOptions="tableCommonOptions"
    :listLoading="listLoading"
    :loadTableData="loadTableData"
    :tableList="tableList"
    ${basicInfo.isCustomCol ? ':onSaveCustom="onSaveCustom"' : ''}
    :searchForm="searchForm"
    ${basicInfo.isFixTableHeight && !isNaN(basicInfo.tableHeight) ? ':height="' + basicInfo.tableHeight + '"': ''}
  />
</template>
<script>
export default {
  data() {
    const tableCommonOptions = {
      searchOptions: {
        isAllHidden: false,
        searchData: [
          ${searchData}
        ]
      },
      filterOptions: {
        isAllHidden: false,
        left: [
          ${filterDataLeft}
        ],
        right: [
          ${filterDataRight}
        ]
      },
      tableOptions: {
        ${basicInfo.isShowCheckBox ? 'isHiddenCheckBox: false,' : 'isHiddenCheckBox: true,'}
        ${basicInfo.isShowOrder ? 'isHiddenOrder: false,' : 'isHiddenOrder: true,'}
        ${basicInfo.isShowHandle ? 'isHiddenOperation: false,' : 'isHiddenOperation: true,'}
        underlineHandles: {
          // 表示如果表格字段为code,则变蓝色下划线并可点击
          code: ({row}) => {
            const params = {
              code: row.code || null 
            }
            alert('gotoDetail');
          }
        },
        columnsData: {
          showColumns: [
            ${tableData}
          ],
          hiddenColumns: []
        },
        headerHandleOperation: { // 操作列示例，不需要可删除
          prop: 'operation',
          label: '操作',
          operationOptions: [{
            name: '修改',
            fn: ({row: {code}}) => {
              const params = {
                code
              }
              alert('gotoDetail');
            },
            disabled: false
          }, {
            name: '删除',
            type: 'danger',
            fn() {
              console.log('删除')
            },
            disabled: true,
          }]
        }
      },
      pagination: {
        total: 0,
        pageNo: 1,
        pageSize: 20
      }
    };
    return {
      tableCommonOptions,
      listLoading: false,
      searchForm: {},
      tableList: [],
    }
  },
  methods: {
    ${basicInfo.isCustomCol ?
    `onSaveCustom(selectedNumber, closeDialog) {
      // 保存自定义列
      const request = {
        userModuleColumnsReqs: (selectedNumber || []).map((item, index) => {
          return {
            columnId: item,
            seq: index + 1
          }
        })
      };
      // 此处需要自己处理@TODO
      this.$store.dispatch('xx/saveCustomColumns', request).then(() => {
        this.loadCustomColumnsList();
        // 更新列表数据
        this.loadTableData();
        closeDialog && closeDialog();
      })
      // 保存自定义列
    },
    loadCustomColumnsList() {
      // 获取自定义列列表
      getCustomizedColumnsList().then(({data}) => {
        // 接口的数据结构showColumns = [{showName, showField, id, refField}]
        // table表头所需
        const columnsMatchParams = {
          prop: 'showField',
          label: 'showName'
        };
        // 自定义列所需
        const customColumnsMatchParams = {
          key: 'id',
          label: 'showName'
        }
        const tableCommonOptions = this.tableCommonOptions;

        tableCommonOptions.tableOptions = {
          ...tableCommonOptions.tableOptions,
            columnsData: data,
            columnsMatchParams,
            customColumnsMatchParams
        }
      })
    },
    ` : ''}
    loadSearchList() {
      // 初始化搜索项
      // 示例：我想给状态搜索项增加下拉
      // const searchData = this.tableCommonOptions.searchOptions.searchData;
      // searchData.find(item => item.name === '状态').selectList = [{text: 'name', value: '1'}]
    },
    loadTableData() {
      const searchForm = this.searchForm;
      const request = {
        ...searchForm,
        startPage: this.tableCommonOptions.pagination.pageNo,
        pageSize: this.tableCommonOptions.pagination.pageSize
      }

      // getTableList(request).then(({data: {data: tableList, total}}) => {
      //   // 表格数据更新
      //   this.tableList = tableList || [],
      //   this.tableCommonOptions.pagination = {
      //     ...this.tableCommonOptions.pagination,
      //     total
      //   }
      // });

    }
  },
  mounted() {
    // // 初始化搜索项
    // this.loadSearchList();
    // // 加载自定义列数据
    // this.loadCustomColumnsList();
    // 加载表格数据
    this.loadTableData();
  },
  activated() {
    // 如果页面使用keep-alive,可以在此处调用加载表格数据接口
  }

}

</script>
<style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }

</style>` 
})

app.on("error",(err, ctx)=>{//捕获异常记录错误日志
  console.log(new Date(),":",err);
});
http.createServer(app.callback()).listen(7211);

// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postData = '';
      ctx.req.addListener('data', (data) => {
        postData += data
      })
      ctx.req.addListener('end', function() {
        try {
        // let parseData = parseQueryStr(postdata)
          resolve(JSON.parse(postData));
        } catch(e) {
          reject(e)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log(queryStrList)
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}