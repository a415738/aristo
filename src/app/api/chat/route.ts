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

    const systemPrompt = `你是 Aristo 的智能客服助手，Aristo 是一个东南亚美妆购物平台。
你可以帮助客户：
- 产品推荐和咨询
- 订单状态和物流查询
- 配送和收货信息
- 退换货政策
- 美妆护肤建议

请始终保持礼貌、专业、友好。回答简洁但信息丰富。
如果遇到无法回答的问题，建议客户联系客服邮箱 support@aristo.com。

请用客户使用的语言回复（中文、英文、泰语、越南语、印尼语或马来语）。`;

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
