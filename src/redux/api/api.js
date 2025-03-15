import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/` }),

  tagTypes: [
    "hostProfile",
    "Challenges",
    "Challenge",
    "Questions",
    "Question",
    "TestCases",
    "Submissions",
    "SubmitCode",
    "Progress",
    "Leaderboard",
    "Batches",
    "Batch",
    "Quiz",
    "QuizLeaderboard"
  ],

  endpoints: (builder) => ({
    updateHost: builder.mutation({
      query: (data) => ({
        url: "/admin/profile",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    userLogout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    hostLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    // Get list of challenges
    myChallenges: builder.query({
      query: () => ({
        url: "admin/challenges",
        credentials: "include",
      }),
      providesTags: ["Challenges"], // Provides this tag for cache invalidation
    }),

    // Create a new challenge
    createChallenge: builder.mutation({
      query: (data) => ({
        url: "challenge/create",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Challenges"], // Invalidates the list of challenges
    }),

    // Fetch challenge data based on the challenge ID
    challengeData: builder.query({
      query: (id) => ({
        url: `challenge/${id}`,
        credentials: "include",
      }),
      providesTags: ["Challenge"],
    }),

    // Edit challenge data
    editChallengeData: builder.mutation({
      query: ({ id, data }) => ({
        url: `challenge/${id}/update`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Challenge", "Challenges"],
    }),

    // Delete a challenge
    deleteChallenge: builder.mutation({
      query: (id) => ({
        url: `admin/challenge/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Challenges"], // Invalidates the challenges list after deletion
    }),

    getQuestions: builder.query({
      query: () => ({
        url: "question/all",
        credentials: "include",
      }),
      providesTags: ["Questions"],
    }),

    addQuestion: builder.mutation({
      query: ({ challengeID, questionID }) => ({
        url: `challenge/${challengeID}/add-question`,
        method: "PUT",
        body: questionID,
        credentials: "include",
      }),
      invalidatesTags: ["Challenge", "Challenges"],
    }),

    removeQuestion: builder.mutation({
      query: ({ id, data }) => ({
        url: `challenge/${id}/remove-question`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Challenges", "Challenge"],
    }),

    questionDetails: builder.query({
      query: (id) => ({
        url: `question/detail/${id}`,
        credentials: "include",
      }),
      providesTags: ["Question"],
    }),

    updateQuestion: builder.mutation({
      query: ({ id, data }) => ({
        url: `/question/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Challenge", "Question"],
    }),

    newQuestion: builder.mutation({
      query: (data) => ({
        url: `/question/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Questions", "Question"],
    }),

    getTestCases: builder.query({
      query: (id) => ({
        url: `testCase/questions/${id}/testcases`,
        credentials: "include",
      }),
      providesTags: ["TestCases"],
    }),

    addTestCase: builder.mutation({
      query: ({ id, data }) => ({
        url: `testCase/questions/${id}/testcases`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["TestCases", "Challenge"],
    }),

    updateTestCase: builder.mutation({
      query: ({ id, data }) => ({
        url: `testCase/testcases/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["TestCases"],
    }),

    deleteTestCase: builder.mutation({
      query: (id) => ({
        url: `testCase/testcases/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["TestCases", "Challenge"],
    }),

    joinChallenge: builder.mutation({
      query: (data) => ({
        url: "challenge/join",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    endChallenge: builder.mutation({
      query: (data) => ({
        url: "challenge/end",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Progress"],
    }),

    getSubmissions: builder.query({
      query: ({ challengeID, questionID }) => ({
        url: `submission/challenge/${challengeID}/question/${questionID}`,
        credentials: "include",
      }),
      providesTags: ["Submissions"],
    }),

    submitCode: builder.mutation({
      query: (data) => ({
        url: "submission/",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Submissions", "Progress"],
    }),

    getProgress: builder.query({
      query: (id) => ({
        url: `challenge/progress/${id}`,
        credentials: "include",
      }),
      providesTags: ["Progress"],
    }),

    calculateLeaderboard: builder.mutation({
      query: (id) => ({
        url: `challenge/leaderboard/${id}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Challenge"],
    }),

    getLeaderboard: builder.query({
      query: (id) => ({
        url: `challenge/leaderboard/${id}`,
        credentials: "include",
      }),
      providesTags: ["Leaderboard"],
    }),

    // Quiz APIs

    myBatches: builder.query({
      query: () => ({
        url: "api/batches/",
        credentials: "include",
      }),
      providesTags: ["Batches"],
    }),

    // Create a new batch
    createBatche: builder.mutation({
      query: (data) => ({
        url: "api/batches",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Batches"],
    }),

    batchData: builder.query({
      query: (id) => ({
        url: `api/batches/${id}`,
        credentials: "include",
      }),
      providesTags: ["Batch"],
    }),

     // Edit batch data
     editBtachData: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/batches/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Batch", "Batches"],
    }),

    // Delete a batch
    deleteBatch: builder.mutation({
      query: (id) => ({
        url: `api/batches/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Batches"], 
    }),

    // approves/rejects join requests for batch
    batchReqests: builder.mutation({
      query: ({id, data})=> ({
        url: `api/batches/manageRequest/${id}`,
        method: "POST",
        credentials: "include",
        body: data
      }),
      invalidatesTags: ["Batch"]
    })
,
    quizData: builder.query({
      query: (id) => ({
        url: `api/quizzes/${id}`,
        credentials: "include",
      }),
      providesTags: ["Quiz"],
    }),

    createQuiz: builder.mutation({
      query: ({id, data})=> ({
        url: `/api/quizzes/${id}`,
        method: "POST",
        credentials: "include",
        body: data
      }),
      invalidatesTags: ["Batch"]
    }),

    // Edit quiz data
    editQuizData: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/quizzes/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),

    // Delete a quiz
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `api/quizzes/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Batch"], 
    }),

    addQuestionToQuiz: builder.mutation({
      query: (data) => ({
        url: `/api/quiz/questions`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Quiz"],
    }),

    editQuizQuestion: builder.mutation({
      query: ({id, data}) => ({
        url: `/api/quiz/questions/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Quiz"],
    }),

    deleteQuizQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/quiz/questions/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Quiz"],
    }),

    getQuizLeaderboard: builder.query({
      query: (id) => ({
        url: `api/quizzes/leaderboard/${id}`,
        credentials: "include",
      }),
      providesTags: ["QuizLeaderboard"],
    }),

  }),

});

export default api;

// Export hooks to be used in components
export const {
  useUpdateHostMutation,
  useMyChallengesQuery,
  useCreateChallengeMutation,
  useChallengeDataQuery,
  useEditChallengeDataMutation,
  useDeleteChallengeMutation,
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useRemoveQuestionMutation,
  useQuestionDetailsQuery,
  useUpdateQuestionMutation,
  useNewQuestionMutation,
  useGetTestCasesQuery,
  useAddTestCaseMutation,
  useUpdateTestCaseMutation,
  useDeleteTestCaseMutation,
  useJoinChallengeMutation,
  useEndChallengeMutation,
  useGetSubmissionsQuery,
  useSubmitCodeMutation,
  useGetProgressQuery,
  useCalculateLeaderboardMutation,
  useGetLeaderboardQuery,
  useUserLogoutMutation,
  useHostLogoutMutation,

  // Quizzes API
  useMyBatchesQuery,
  useCreateBatcheMutation,
  useBatchDataQuery,
  useEditBtachDataMutation,
  useDeleteBatchMutation,
  useBatchReqestsMutation,
  useQuizDataQuery,
  useEditQuizDataMutation,
  useDeleteQuizMutation,
  useAddQuestionToQuizMutation,
  useEditQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
  useCreateQuizMutation,
  useGetQuizLeaderboardQuery
} = api;
