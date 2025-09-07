import axios from 'axios';
import { logger } from '@/utils/logger';

export interface AiResponse {
  answer: string;
  model: string;
  tokensUsed?: number;
}

export class AiService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gpt-4o-mini';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  private isValidApiKey(apiKey: string): boolean {
    return Boolean(
      apiKey &&
        apiKey.length > 0 &&
        apiKey.startsWith('sk-') &&
        !apiKey.includes('your-openai-api-key'),
    );
  }

  async askQuestion(question: string): Promise<AiResponse> {
    try {
      if (!this.isValidApiKey(this.apiKey)) {
        // Fallback mock response for development/testing
        logger.info('Using mock AI response - no valid API key provided');
        return this.getMockResponse(question);
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant. Provide clear, accurate, and concise answers.',
            },
            {
              role: 'user',
              content: question,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        },
      );

      const answer =
        response.data.choices[0]?.message?.content ||
        'I apologize, but I could not generate a response at this time.';
      const tokensUsed = response.data.usage?.total_tokens;

      logger.info('AI question processed', {
        model: this.model,
        tokensUsed,
        questionLength: question.length,
        answerLength: answer.length,
      });

      return {
        answer,
        model: this.model,
        tokensUsed,
      };
    } catch (error) {
      logger.error('AI service error:', error);

      // Return a fallback response
      return {
        answer:
          'I apologize, but I am currently experiencing technical difficulties. Please try again later.',
        model: this.model,
      };
    }
  }

  private getMockResponse(question: string): AiResponse {
    // Create more intelligent mock responses based on question content
    const questionLower = question.toLowerCase();
    let response = '';

    if (
      questionLower.includes('artificial intelligence') ||
      questionLower.includes('ai')
    ) {
      response = `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. AI works through several key approaches:

1. **Machine Learning**: Systems that can learn and improve from experience without being explicitly programmed for every task.

2. **Neural Networks**: Computing systems inspired by biological neural networks, which process information through interconnected nodes.

3. **Data Processing**: AI analyzes large amounts of data to identify patterns, make predictions, and generate insights.

4. **Algorithms**: Mathematical procedures that enable machines to process information, recognize patterns, and make decisions.

AI applications include natural language processing, computer vision, robotics, and decision-making systems. Modern AI systems like GPT models use deep learning to understand and generate human-like text by training on vast datasets.

*Note: This is a mock response for development purposes.*`;
    } else if (
      questionLower.includes('machine learning') ||
      questionLower.includes('ml')
    ) {
      response = `Machine Learning is a subset of artificial intelligence that enables computers to learn and improve automatically from experience without being explicitly programmed. It works by identifying patterns in data and making predictions or decisions based on those patterns.

*Note: This is a mock response for development purposes.*`;
    } else if (
      questionLower.includes('programming') ||
      questionLower.includes('code')
    ) {
      response = `Programming involves writing instructions for computers to execute specific tasks. It requires understanding programming languages, algorithms, and problem-solving techniques to create software applications.

*Note: This is a mock response for development purposes.*`;
    } else {
      // Generic responses for other questions
      const genericResponses = [
        `Thank you for your question about "${question.slice(0, 50)}${question.length > 50 ? '...' : ''}". This is a simulated AI response for development purposes. In a production environment, this would be answered by a real AI model.`,
        `I understand you're asking about ${question.split(' ').slice(0, 5).join(' ')}. This is a test response generated by the mock AI service for development and testing purposes.`,
        `Your question has been received and processed. This mock response demonstrates how the AI service would handle your inquiry about: ${question.slice(0, 40)}${question.length > 40 ? '...' : ''}`,
      ];
      response =
        genericResponses[Math.floor(Math.random() * genericResponses.length)] ||
        'Thank you for your question. This is a mock response for development purposes.';
    }

    logger.info('Mock AI response generated', {
      questionLength: question.length,
      answerLength: response.length,
      questionType:
        questionLower.includes('ai') ||
        questionLower.includes('artificial intelligence')
          ? 'AI-related'
          : 'general',
    });

    return {
      answer: response,
      model: 'mock-model',
      tokensUsed: Math.floor(response.length / 4), // Approximate token count
    };
  }
}
