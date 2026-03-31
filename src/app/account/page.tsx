import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderList } from '@/components/account/OrderList';
import { AddressList } from '@/components/account/AddressList';
import { ProfileForm } from '@/components/account/ProfileForm';

export default function AccountPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderList />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressList />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
