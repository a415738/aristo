'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

// Mock addresses
const mockAddresses = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+66 123 456 789',
    country: 'Thailand',
    province: 'Bangkok',
    city: 'Bangkok',
    address: '123 Sukhumvit Road',
    postal_code: '10110',
    is_default: true,
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '+66 987 654 321',
    country: 'Vietnam',
    province: 'Ho Chi Minh',
    city: 'Ho Chi Minh City',
    address: '456 Nguyen Hue Street',
    postal_code: '700000',
    is_default: false,
  },
];

export function AddressList() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);

  const setDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      is_default: addr.id === id,
    })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <Button onClick={() => setIsAdding(!isAdding)}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Address
      </Button>

      {/* Add Form */}
      {isAdding && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Enter country" />
              </div>
              <div>
                <Label htmlFor="province">Province/State</Label>
                <Input id="province" placeholder="Enter province/state" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Enter city" />
              </div>
              <div>
                <Label htmlFor="postal">Postal Code</Label>
                <Input id="postal" placeholder="Enter postal code" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="Enter street address" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsAdding(false)}>Save Address</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={address.is_default ? 'border-primary' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.name}</span>
                  {address.is_default && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDefault(address.id)}
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAddress(address.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600 mt-1">
                {address.address}, {address.city}, {address.province}
              </p>
              <p className="text-sm text-gray-600">
                {address.country} {address.postal_code}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
