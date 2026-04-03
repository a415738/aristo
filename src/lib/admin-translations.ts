'use client';

// 后台专用中文翻译文本
export const adminTranslations = {
  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    back: '返回',
    submit: '提交',
    required: '必填',
    optional: '选填',
    yes: '是',
    no: '否',
    all: '全部',
    search: '搜索',
    actions: '操作',
  },

  // 导航
  nav: {
    search: '搜索',
  },

  // 后台菜单
  admin: {
    dashboard: '控制台',
    products: '商品管理',
    brands: '品牌管理',
    orders: '订单管理',
    users: '用户管理',
    marketing: '运营管理',
    settings: '系统设置',
    chat: '客服管理',
    totalOrders: '总订单数',
    totalProducts: '商品总数',
    totalUsers: '用户总数',
    totalRevenue: '总收入',
    pendingOrders: '待处理订单',
    lowStock: '库存不足',
  },

  // 订单状态
  orderStatus: {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    delivered: '已完成',
    cancelled: '已取消',
  },

  // 商品表单
  productForm: {
    title: '商品信息',
    name: '商品名称',
    slug: 'URL别名',
    sku: 'SKU编码',
    category: '商品分类',
    brand: '品牌',
    price: '价格',
    retailPrice: '零售价',
    stock: '库存',
    description: '商品描述',
    tags: '商品标签',
    images: '商品图片',
    specs: '商品属性',
    variants: '规格变体',
    save: '保存商品',
    cancel: '取消',
    loadTemplate: '加载属性模板',
    addSpec: '添加属性',
    addVariant: '添加规格',
    noSpecs: '暂无商品属性',
    noVariants: '暂无规格变体',
    specName: '属性名称',
    specValue: '属性值',
    variantName: '规格名称',
    variantPrice: '价格',
    variantStock: '库存',
    mainImage: '主图',
    maxImages: '最多12张，第一张为主图',
  },

  // 品牌
  brands: {
    origin: '产地',
    products: '商品',
    featured: '推荐',
    active: '启用',
    noBrands: '暂无品牌',
  },

  // 消息
  messages: {
    noProducts: '暂无商品',
    noResults: '未找到结果',
    noBrands: '暂无品牌',
    noOrders: '暂无订单',
  },

  // 账户
  account: {
    orders: '订单',
    orderNumber: '订单号',
    orderDate: '下单时间',
    orderStatus: '状态',
    orderTotal: '金额',
  },

  // 购物车
  cart: {
    total: '合计',
  },

  // 商品
  product: {
    inStock: '有货',
    outOfStock: '缺货',
    sold: '已售',
  },

  // 筛选
  filters: {
    title: '筛选',
    sort: '排序',
  },

  // 登录
  login: {
    title: '管理后台登录',
    subtitle: '请输入管理员账户和密码',
    username: '用户名',
    password: '密码',
    loginButton: '登录',
    loggingIn: '登录中...',
    error: '用户名或密码错误',
    defaultAccount: '默认账户：admin',
    defaultPassword: '默认密码：123456',
    viewSite: '返回网站首页',
    placeholder: {
      username: '请输入用户名',
      password: '请输入密码',
    },
  },

  // 加载
  loading: {
    checking: '加载中...',
  },

  // 用户菜单
  userMenu: {
    viewSite: '查看网站',
    logout: '退出登录',
    admin: '管理员',
  },
};
