<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cataList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        :border="true"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_pid)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_name">
          <el-cascader
            v-model="selectedCates"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover' , value:'cat_id' , label:'cat_name',children:'children' }"
            @change="parentCateChange"
            :clearable="true"
            change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品列表 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form :model="editCateForm" ref="editCateFormRef" label-width="90px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cataList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      addCateForm: { cat_name: "", cat_pid: 0, cat_level: 0 },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList: [],
      selectedCates: [],
      editCateDialogVisible: false,
      editCateForm: {}
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cataList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      this.parentCateList = res.data;
    },
    parentCateChange() {
      if (this.selectedCates.length > 0) {
        this.addCateForm.cat_pid = this.selectedCates[
          this.selectedCates.length - 1
        ];
        this.addCateForm.cat_level = this.selectedCates.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加商品分类失败");
        this.$message.success("添加商品分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedCates = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    async removeCateById(id) {
      console.log(id);

      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品分类失败");
      }
      this.$message.success("删除商品分类成功");
      this.getCateList();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询商品失败");
      }
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    editCateDialogClose() {
      this.$refs.editCateFormRef.resetFields();
    },
    async editCate() {
      const { data: res } = await this.$http.put(
        "categories/" + this.editCateForm.cat_id,
        {
          cat_name: this.editCateForm.cat_name
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改商品分类失败");
      }
      this.$message.success("修改商品分类成功");
      this.getCateList();
      this.editCateDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>