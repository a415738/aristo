import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const systemPrompt = `You are a helpful customer service assistant for BeautyMart, a B2B2C beauty e-commerce platform in Southeast Asia. 
You help customers with:
- Product recommendations and inquiries
- Order status and tracking
- Shipping and delivery information
- Wholesale pricing and bulk orders
- Returns and refunds
- General beauty advice

Always be polite, professional, and helpful. Keep responses concise but informative.
If you don't know something specific, suggest the customer contact support at support@beautymart.com.

Respond in the same language the customer uses (English, Thai, Vietnamese, Indonesian, or Malay).`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: message },
    ];

    // Use invoke for non-streaming response
    const response = await client.invoke(messages, {
      model: 'doubao-seed-1-6-lite-251015',
      temperature: 0.7,
    });

    return NextResponse.json({ message: response.content });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
