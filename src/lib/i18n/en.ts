// Frontend translations - English
export const en = {
  // Navigation
  nav: {
    home: 'Home',
    allProducts: 'All Products',
    brands: 'Brands',
    cart: 'Cart',
    login: 'Login',
    register: 'Register',
    account: 'Account',
    logout: 'Logout',
    search: 'Search',
    searchPlaceholder: 'Search products...',
  },
  
  // Categories
  categories: {
    all: 'All Categories',
    skinCare: 'Skin Care',
    makeup: 'Makeup',
    baseMakeup: 'Base Makeup',
    lips: 'Lips',
    eyes: 'Eyes',
    fragrance: 'Fragrance',
    bodyCare: 'Body Care',
    hairCare: 'Hair Care',
    beautyTools: 'Beauty Tools',
    giftSets: 'Gift Sets',
  },
  
  // Product
  product: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    reviews: 'Reviews',
    description: 'Description',
    specifications: 'Specifications',
    relatedProducts: 'Related Products',
    viewAll: 'View All',
    sold: 'Sold',
    price: 'Price',
    quantity: 'Quantity',
    selectOptions: 'Select Options',
    addSuccess: 'Added to cart successfully',
    details: 'Product Details',
  },
  
  // Cart
  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    total: 'Total',
    remove: 'Remove',
    quantity: 'Qty',
  },
  
  // Account
  account: {
    title: 'My Account',
    orders: 'Orders',
    addresses: 'Addresses',
    profile: 'Profile',
    favorites: 'Favorites',
    settings: 'Settings',
    orderHistory: 'Order History',
    orderNumber: 'Order #',
    orderDate: 'Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    noOrders: 'No orders yet',
  },
  
  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
  },
  
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
  },
  
  // Filters
  filters: {
    title: 'Filters',
    sort: 'Sort',
    sortBy: 'Sort By',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    apply: 'Apply',
    reset: 'Reset',
    clearAll: 'Clear All',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    newest: 'Newest',
    popular: 'Popular',
    sales: 'Best Sales',
  },
  
  // Brands
  brands: {
    title: 'Brands',
    allBrands: 'All Brands',
    featured: 'Featured Brands',
    origin: 'Origin',
    products: 'Products',
    noBrands: 'No brands found',
  },
  
  // Footer
  footer: {
    customerService: 'Customer Service',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    faq: 'FAQ',
    shipping: 'Shipping Info',
    returns: 'Returns',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    emailPlaceholder: 'Enter your email',
    copyright: 'All rights reserved.',
  },
  
  // Messages
  messages: {
    noProducts: 'No products found',
    tryOtherFilters: 'Try other filters',
    noResults: 'No results found',
    serverError: 'Server error, please try again later',
    networkError: 'Network error, please check your connection',
  },
  
  // Admin
  admin: {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    users: 'Users',
    brands: 'Brands',
    marketing: 'Marketing',
    settings: 'Settings',
    chat: 'Chat',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    totalUsers: 'Total Users',
    totalRevenue: 'Total Revenue',
    pendingOrders: 'Pending Orders',
    lowStock: 'Low Stock',
  },
  
  // Order Status
  orderStatus: {
    pending: 'Pending',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  
  // Product Form (Admin)
  productForm: {
    title: 'Product Information',
    name: 'Product Name',
    slug: 'URL Slug',
    sku: 'SKU',
    category: 'Category',
    brand: 'Brand',
    price: 'Price',
    retailPrice: 'Retail Price',
    stock: 'Stock',
    description: 'Description',
    tags: 'Tags',
    images: 'Product Images',
    specs: 'Specifications',
    variants: 'Variants',
    save: 'Save Product',
    cancel: 'Cancel',
    loadTemplate: 'Load Template',
    addSpec: 'Add Specification',
    addVariant: 'Add Variant',
    noSpecs: 'No specifications',
    noVariants: 'No variants',
    specName: 'Spec Name',
    specValue: 'Spec Value',
    variantName: 'Variant Name',
    variantPrice: 'Price',
    variantStock: 'Stock',
    required: 'Required',
    optional: 'Optional',
    mainImage: 'Main Image',
    maxImages: 'Max 12 images, first is main',
  },
  
  // Home
  home: {
    hotProducts: 'Hot Products',
    newArrivals: 'New Arrivals',
    shopNow: 'Shop Now',
    viewMore: 'View More',
  },
};

// Type for the translations
export type Translations = typeof en;
