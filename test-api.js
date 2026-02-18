const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testAPI() {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log('✅ API key works!');
    console.log('Response:', message.content[0].text);
  } catch (error) {
    console.error('❌ API error:', error.message);
    if (error.status === 401) {
      console.error('Invalid API key');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded or insufficient credits');
    }
  }
}

testAPI();
