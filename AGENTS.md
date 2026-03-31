# Aristo - Southeast Asia Beauty E-commerce Platform

## Project Overview

Aristo is a comprehensive e-commerce platform for beauty products targeting the Southeast Asian market. It supports retail operations with multi-language and multi-currency capabilities.

### Key Features

- **B2B2C Model**: Supports both retail and wholesale pricing with minimum order quantities
- **Multi-language**: English, Thai, Vietnamese, Indonesian, Malay
- **Multi-currency**: USD, THB, VND, IDR, MYR
- **Responsive Design**: PC and mobile adaptive layout
- **Brand Gallery**: Dedicated brand pages with product listings
- **Admin Dashboard**: Complete backend management system
- **AI Customer Service**: LLM-powered chatbot for customer support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle
- **Storage**: S3-compatible object storage
- **AI**: LLM integration via coze-coding-dev-sdk

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout with chat widget
│   │   ├── products/           # Product pages
│   │   │   ├── page.tsx        # Product listing
│   │   │   └── [slug]/page.tsx # Product detail
│   │   ├── brands/             # Brand pages
│   │   │   ├── page.tsx        # Brand gallery
│   │   │   └── [slug]/page.tsx # Brand detail
│   │   ├── wholesale/          # Wholesale zone
│   │   ├── cart/               # Shopping cart
│   │   ├── account/            # User center
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── products/       # Product management
│   │   │   └── orders/         # Order management
│   │   └── api/                # API routes
│   │       └── chat/route.ts   # Chat API
│   ├── components/             # React components
│   │   ├── layout/             # Header, Footer, Layout
│   │   ├── home/               # Homepage sections
│   │   ├── products/           # Product components
│   │   ├── account/            # Account components
│   │   ├── admin/              # Admin components
│   │   └── chat/               # Chat widget
│   ├── lib/                    # Utilities
│   │   ├── utils.ts            # Helper functions
│   │   └── storage.ts          # S3 storage client
│   └── storage/                # Database
│       └── database/
│           ├── shared/schema.ts # Drizzle schema
│           └── supabase-client.ts # Supabase client
├── public/                     # Static assets
└── .coze                       # Deployment config
```

## Database Schema

### Core Tables

- **users**: User accounts with role-based access
- **categories**: Product categories with hierarchy support
- **brands**: Brand information with logos and banners
- **products**: Main product catalog with retail/wholesale pricing
- **product_images**: Product image gallery
- **product_variants**: Product variants (size, color, etc.)
- **orders**: Customer orders
- **order_items**: Order line items
- **cart_items**: Shopping cart
- **banners**: Homepage banners
- **coupons**: Discount coupons
- **user_addresses**: Shipping addresses
- **favorites**: Product favorites/wishlist
- **chat_messages**: Customer service chat history
- **languages**: Supported languages
- **currencies**: Supported currencies with exchange rates
- **site_settings**: Site configuration

## API Routes

- `POST /api/chat`: AI customer service chat endpoint

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
coze dev

# Build for production
coze build

# Start production server
coze start

# Database migrations
coze-coding-ai db generate-models  # Sync schema from database
coze-coding-ai db upgrade          # Push schema changes to database

# Type checking
npx tsc --noEmit
```

## Environment Variables

Required environment variables (auto-configured in sandbox):

- `COZE_WORKSPACE_PATH`: Project workspace directory
- `DEPLOY_RUN_PORT`: Server port (5000)
- `COZE_PROJECT_DOMAIN_DEFAULT`: Public access domain
- `COZE_SUPABASE_URL`: Supabase project URL
- `COZE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `COZE_BUCKET_ENDPOINT_URL`: S3 storage endpoint
- `COZE_BUCKET_NAME`: S3 bucket name

## Page Routes

### Frontend (Customer-facing)

| Route | Description |
|-------|-------------|
| `/` | Homepage with banners, categories, featured products |
| `/products` | Product listing with filters and pagination |
| `/products/[slug]` | Product detail page |
| `/brands` | Brand gallery |
| `/brands/[slug]` | Brand detail with products |
| `/wholesale` | Wholesale zone |
| `/cart` | Shopping cart |
| `/account` | User center (orders, addresses, profile) |

### Backend (Admin)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with statistics |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |
| `/admin/users` | User management |
| `/admin/brands` | Brand management |
| `/admin/marketing` | Marketing (banners, coupons) |
| `/admin/settings` | System settings |
| `/admin/chat` | Customer service chat |

## Key Components

### Layout Components
- `Header`: Navigation, search, cart, user menu
- `Footer`: Site info, links, contact
- `Layout`: Main layout wrapper
- `ChatWidget`: Floating customer service chat

### Homepage Components
- `HeroBanner`: Carousel banner
- `CategorySection`: Category grid
- `ProductSection`: Product carousel/grid
- `BrandSection`: Brand logos
- `WholesaleSection`: Wholesale promotion

### Product Components
- `ProductList`: Product grid with pagination
- `ProductFilters`: Category, brand, price filters
- `ProductDetail`: Product page with variants
- `RelatedProducts`: Related product suggestions

### Admin Components
- `AdminLayout`: Admin sidebar and layout
- `DashboardStats`: Statistics cards
- `ProductTable`: Product management table
- `OrderTable`: Order management table

## Styling Guidelines

- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Responsive breakpoints: `md:768px`, `lg:1024px`
- Primary color defined in CSS variables
- Use `cn()` utility for conditional class merging

## Database Operations

All database operations use Supabase client:

```typescript
import { getSupabaseClient } from '@/storage/database/supabase-client';

const client = getSupabaseClient();
const { data, error } = await client.from('products').select('*');
```

## Deployment

The project is configured for deployment via Coze platform:

1. Build command: `pnpm run build`
2. Start command: `pnpm run start`
3. Port: 5000 (required)
4. Hot reload enabled in development

## Future Enhancements

- User authentication with Supabase Auth
- Payment gateway integration
- Order tracking and notifications
- Inventory management
- Multi-warehouse support
- Analytics and reporting
- Email marketing integration
