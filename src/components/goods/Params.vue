<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="只允许为三级分类设置参数" type="warning" :closable="false" :show-icon="true"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCates"
            :options="cataList"
            :props="{ expandTrigger: 'hover' , value:'cat_id' , label:'cat_name',children:'children' }"
            @change="cateChange"
            :clearable="true"
            change-on-select="true"
            class="cas"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" :border="true" :stripe="true">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  :closable="true"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeCateById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" :border="true" :stripe="true">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  :closable="true"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeCateById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cataList: [],
      selectedCates: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cataList = res.data;
    },
    async cateChange() {
      this.getParamsData();
    },
    handleClick() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCates.length !== 3) {
        this.selectedCates = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");
        this.editDialogVisible = false;
        this.getParamsData();
      });
    },
    async removeCateById(attr_id) {
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

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
      this.getParamsData();
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCates.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCates.length === 3) {
        return this.selectedCates[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 10px;
}
.cas {
  margin-left: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>