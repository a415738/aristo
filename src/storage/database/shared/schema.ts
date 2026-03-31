import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, numeric, jsonb, index, serial } from "drizzle-orm/pg-core";

// ==================== 用户相关表 ====================

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 128 }),
    phone: varchar("phone", { length: 20 }),
    avatar: varchar("avatar", { length: 500 }),
    role: varchar("role", { length: 20 }).notNull().default("customer"), // customer, admin, wholesaler
    is_active: boolean("is_active").default(true).notNull(),
    language: varchar("language", { length: 10 }).default("en"),
    currency: varchar("currency", { length: 10 }).default("USD"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

export const userAddresses = pgTable(
  "user_addresses",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    province: varchar("province", { length: 100 }),
    city: varchar("city", { length: 100 }).notNull(),
    address: varchar("address", { length: 500 }).notNull(),
    postal_code: varchar("postal_code", { length: 20 }),
    is_default: boolean("is_default").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("user_addresses_user_id_idx").on(table.user_id),
  ]
);

// ==================== 商品相关表 ====================

export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    description: text("description"),
    image: varchar("image", { length: 500 }),
    parent_id: varchar("parent_id", { length: 36 }),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("categories_slug_idx").on(table.slug),
    index("categories_parent_id_idx").on(table.parent_id),
  ]
);

export const brands = pgTable(
  "brands",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    logo: varchar("logo", { length: 500 }),
    banner: varchar("banner", { length: 500 }),
    description: text("description"),
    country: varchar("country", { length: 100 }),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("brands_slug_idx").on(table.slug),
  ]
);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    category_id: varchar("category_id", { length: 36 }).notNull().references(() => categories.id),
    brand_id: varchar("brand_id", { length: 36 }).notNull().references(() => brands.id),
    main_image: varchar("main_image", { length: 500 }).notNull(),
    retail_price: numeric("retail_price", { precision: 10, scale: 2 }).notNull(),
    wholesale_price: numeric("wholesale_price", { precision: 10, scale: 2 }),
    min_wholesale_qty: integer("min_wholesale_qty").default(10),
    stock: integer("stock").notNull().default(0),
    sku: varchar("sku", { length: 100 }),
    specs: jsonb("specs"), // 规格: [{name: "颜色", value: "红色"}, ...]
    tags: jsonb("tags"), // 标签: ["热销", "新品"]
    is_active: boolean("is_active").default(true).notNull(),
    is_wholesale: boolean("is_wholesale").default(false).notNull(),
    sales_count: integer("sales_count").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_category_id_idx").on(table.category_id),
    index("products_brand_id_idx").on(table.brand_id),
    index("products_is_active_idx").on(table.is_active),
    index("products_sales_count_idx").on(table.sales_count),
  ]
);

export const productImages = pgTable(
  "product_images",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
    image: varchar("image", { length: 500 }).notNull(),
    sort_order: integer("sort_order").default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("product_images_product_id_idx").on(table.product_id),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(), // 如: "红色-30ml"
    sku: varchar("sku", { length: 100 }),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    stock: integer("stock").notNull().default(0),
    image: varchar("image", { length: 500 }),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("product_variants_product_id_idx").on(table.product_id),
  ]
);

// ==================== 订单相关表 ====================

export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_no: varchar("order_no", { length: 50 }).notNull().unique(),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, paid, shipped, delivered, cancelled
    payment_method: varchar("payment_method", { length: 50 }),
    payment_status: varchar("payment_status", { length: 20 }).default("unpaid"), // unpaid, paid, refunded
    shipping_method: varchar("shipping_method", { length: 50 }),
    shipping_no: varchar("shipping_no", { length: 100 }),
    // 收货地址
    shipping_name: varchar("shipping_name", { length: 128 }).notNull(),
    shipping_phone: varchar("shipping_phone", { length: 20 }).notNull(),
    shipping_country: varchar("shipping_country", { length: 100 }).notNull(),
    shipping_province: varchar("shipping_province", { length: 100 }),
    shipping_city: varchar("shipping_city", { length: 100 }).notNull(),
    shipping_address: varchar("shipping_address", { length: 500 }).notNull(),
    shipping_postal_code: varchar("shipping_postal_code", { length: 20 }),
    // 金额
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    shipping_fee: numeric("shipping_fee", { precision: 10, scale: 2 }).default("0"),
    discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("USD"),
    // 其他
    note: text("note"),
    admin_note: text("admin_note"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    paid_at: timestamp("paid_at", { withTimezone: true }),
    shipped_at: timestamp("shipped_at", { withTimezone: true }),
    delivered_at: timestamp("delivered_at", { withTimezone: true }),
  },
  (table) => [
    index("orders_order_no_idx").on(table.order_no),
    index("orders_user_id_idx").on(table.user_id),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.created_at),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
    product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id),
    variant_id: varchar("variant_id", { length: 36 }).references(() => productVariants.id),
    product_name: varchar("product_name", { length: 255 }).notNull(),
    variant_name: varchar("variant_name", { length: 128 }),
    image: varchar("image", { length: 500 }),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.order_id),
    index("order_items_product_id_idx").on(table.product_id),
  ]
);

// ==================== 购物车 ====================

export const cartItems = pgTable(
  "cart_items",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id),
    variant_id: varchar("variant_id", { length: 36 }).references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("cart_items_user_id_idx").on(table.user_id),
    index("cart_items_product_id_idx").on(table.product_id),
  ]
);

// ==================== 运营相关表 ====================

export const banners = pgTable(
  "banners",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }),
    image: varchar("image", { length: 500 }).notNull(),
    link: varchar("link", { length: 500 }),
    position: varchar("position", { length: 50 }).default("home"), // home, category, etc.
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    start_at: timestamp("start_at", { withTimezone: true }),
    end_at: timestamp("end_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("banners_position_idx").on(table.position),
    index("banners_is_active_idx").on(table.is_active),
  ]
);

export const coupons = pgTable(
  "coupons",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // percentage, fixed
    value: numeric("value", { precision: 10, scale: 2 }).notNull(),
    min_order_amount: numeric("min_order_amount", { precision: 10, scale: 2 }),
    max_discount: numeric("max_discount", { precision: 10, scale: 2 }),
    usage_limit: integer("usage_limit"),
    used_count: integer("used_count").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    start_at: timestamp("start_at", { withTimezone: true }),
    end_at: timestamp("end_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("coupons_code_idx").on(table.code),
  ]
);

export const userCoupons = pgTable(
  "user_coupons",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    coupon_id: varchar("coupon_id", { length: 36 }).notNull().references(() => coupons.id, { onDelete: "cascade" }),
    is_used: boolean("is_used").default(false).notNull(),
    used_at: timestamp("used_at", { withTimezone: true }),
    order_id: varchar("order_id", { length: 36 }).references(() => orders.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("user_coupons_user_id_idx").on(table.user_id),
    index("user_coupons_coupon_id_idx").on(table.coupon_id),
  ]
);

// ==================== 收藏 ====================

export const favorites = pgTable(
  "favorites",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("favorites_user_id_idx").on(table.user_id),
    index("favorites_product_id_idx").on(table.product_id),
  ]
);

// ==================== 系统设置 ====================

export const siteSettings = pgTable(
  "site_settings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
    description: varchar("description", { length: 255 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("site_settings_key_idx").on(table.key),
  ]
);

export const languages = pgTable(
  "languages",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 10 }).notNull().unique(), // en, th, vi, id, ms
    name: varchar("name", { length: 50 }).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    is_default: boolean("is_default").default(false).notNull(),
    sort_order: integer("sort_order").default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("languages_code_idx").on(table.code),
  ]
);

export const currencies = pgTable(
  "currencies",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 10 }).notNull().unique(), // USD, THB, VND, IDR, MYR
    name: varchar("name", { length: 50 }).notNull(),
    symbol: varchar("symbol", { length: 10 }).notNull(),
    exchange_rate: numeric("exchange_rate", { precision: 10, scale: 4 }).notNull().default("1"),
    is_active: boolean("is_active").default(true).notNull(),
    is_default: boolean("is_default").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("currencies_code_idx").on(table.code),
  ]
);

// ==================== 客服聊天 ====================

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    message: text("message").notNull(),
    sender: varchar("sender", { length: 20 }).notNull(), // user, bot, admin
    is_read: boolean("is_read").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("chat_messages_user_id_idx").on(table.user_id),
    index("chat_messages_created_at_idx").on(table.created_at),
  ]
);

// 系统健康检查表（禁止删除）
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
