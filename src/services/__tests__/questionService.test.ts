import { QuestionService } from '../questionService';
import { AuthService } from '../authService';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let authService: AuthService;
  let userContext: { userId: string; companyId: string };

  beforeAll(() => {
    authService = new AuthService();
  });

  beforeEach(async () => {
    questionService = new QuestionService();

    // Create a user and company to use in tests
    const { user, company } = await authService.register(
      'qs_user@example.com',
      'password123',
      'QS User',
      'QS Company',
    );
    userContext = { userId: user.id, companyId: company.id };
  });

  it('should create a question and return saved record', async () => {
    const q = await questionService.askQuestion(
      'What is artificial intelligence?',
      userContext.userId,
      userContext.companyId,
    );

    expect(q).toBeDefined();
    expect(q.question).toContain('artificial intelligence');
    expect(q.answer.length).toBeGreaterThan(0);
    expect(q.userId).toBe(userContext.userId);
    expect(q.companyId).toBe(userContext.companyId);
  });

  it('should paginate user questions', async () => {
    // seed a few questions
    await Promise.all(
      Array.from({ length: 12 }).map((_, i) =>
        questionService.askQuestion(
          `Question ${i + 1}?`,
          userContext.userId,
          userContext.companyId,
        ),
      ),
    );

    const page1 = await questionService.getUserQuestions(
      userContext.userId,
      userContext.companyId,
      { page: 1, limit: 5 },
    );
    const page3 = await questionService.getUserQuestions(
      userContext.userId,
      userContext.companyId,
      { page: 3, limit: 5 },
    );

    expect(page1.pagination.total).toBe(12);
    expect(page1.data.length).toBe(5);
    expect(page3.data.length).toBe(2);
  });

  it('should not return questions from other companies', async () => {
    // create another company/user and add a question there
    const other = await authService.register(
      'other@example.com',
      'password123',
      'Other User',
      'Other Company',
    );
    await questionService.askQuestion(
      'Other company question',
      other.user.id,
      other.company.id,
    );

    const res = await questionService.getCompanyQuestions(
      userContext.companyId,
      { page: 1, limit: 50 },
    );
    expect(
      res.data.find((q) => q.companyId === other.company.id),
    ).toBeUndefined();
  });

  it('should fetch stats and top users for admin dashboard', async () => {
    await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        questionService.askQuestion(
          `Stat Question ${i + 1}`,
          userContext.userId,
          userContext.companyId,
        ),
      ),
    );

    const stats = await questionService.getQuestionStats(
      userContext.companyId,
      7,
    );
    const topUsers = await questionService.getTopUsers(
      userContext.companyId,
      5,
    );

    expect(Array.isArray(stats)).toBe(true);
    expect(Array.isArray(topUsers)).toBe(true);
    expect(topUsers.length).toBeGreaterThan(0);
    expect(topUsers[0]!).toHaveProperty('userId');
    expect(topUsers[0]!.questionCount).toBeGreaterThan(0);
  });

  it('should return null when getting a question by id from another company', async () => {
    const q = await questionService.askQuestion(
      'Company-bound question',
      userContext.userId,
      userContext.companyId,
    );

    const other = await authService.register(
      'third@example.com',
      'password123',
      'Third User',
      'Third Company',
    );

    const found = await questionService.getQuestionById(q.id, other.company.id);
    expect(found).toBeNull();
  });
});
