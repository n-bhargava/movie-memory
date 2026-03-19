

jest.mock("groq-sdk", () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn().mockResolvedValue({
                    choices: [{
                        message: { content: "A fun test fact." }
                    }],
                }),
            },
        },
    }));
});

jest.mock("@/lib/auth", () => ({
    auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
    prisma: {
        movie: { findUnique: jest.fn() },
        fact: { findFirst: jest.fn(), create: jest.fn() }
    },
}));


import { GET } from "@/app/api/fact/route";
import { prisma } from "@/lib/prisma";
const { auth } = require("@/lib/auth");

const mockMovie = { findUnique: jest.fn() };
const mockFact = { findFirst: jest.fn(), create: jest.fn() };


const MOCK_USER_ID = "test-user-id";
const MOCK_MOVIE = { id: "movie-id", title: "Inception", userId: MOCK_USER_ID };
const MOCK_FACT = {
    id: "fact-id",
    content: "Inception was filmed in six different countries.",
    userId: MOCK_USER_ID,
    movieId: MOCK_MOVIE.id,
    generatedAt: new Date(),
};

beforeEach(() => {
    jest.clearAllMocks();
    auth.mockResolvedValue({ user: { id: MOCK_USER_ID } });
    (prisma.movie.findUnique as jest.Mock).mockResolvedValue(MOCK_MOVIE);
});

describe("GET /api/fact", () => {
    describe("Cache behavior", () => {
        it("returns cached fact if one exists within 60 seconds", async () => {
            (prisma.fact.findFirst as jest.Mock).mockResolvedValueOnce(MOCK_FACT);

            const response = await GET();
            const data = await response.json();

            expect(data.cached).toBe(true);
            expect(data.fact).toBe(MOCK_FACT.content);
            expect(prisma.fact.create).not.toHaveBeenCalled();
        });

        it("generates a new fact if no recent cached fact exists", async () => {
            (prisma.fact.findFirst as jest.Mock).mockResolvedValueOnce(null);
            (prisma.fact.create as jest.Mock).mockResolvedValueOnce(MOCK_FACT);

            const response = await GET();
            const data = await response.json();

            expect(data.cached).toBe(false);
            expect(data.fact).toBe("Inception was filmed in six different countries.");
            expect(prisma.fact.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("Authorization", () => {
        it ("returns 401 if user is not authenticated", async () => {
            auth.mockResolvedValue(null);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe("Unauthorized");
        });

        it("returns 404 if user has no movie", async () => {
            (prisma.movie.findUnique as jest.Mock).mockResolvedValueOnce(null);
            
            const response = await GET();
            const data = await response.json();
            
            expect(response.status).toBe(404);
            expect(data.error).toBe("No favorite movie found");
        });
    });
});