import Vue from 'vue'
import { TimelineItem, Timeline, Upload, Checkbox, CheckboxGroup, Steps, Step, Tabs, TabPane, Alert, Cascader, Option, Select, Tree, Tag, MessageBox, Dialog, Pagination, Tooltip, Switch, Table, TableColumn, Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, Row, Col, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card } from 'element-ui'

Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Steps)
Vue.use(Step)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm