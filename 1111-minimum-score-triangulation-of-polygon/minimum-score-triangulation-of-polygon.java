class Solution {
    public int minScore(int[] v, int i, int j, int[][] dp) {
        if (j - i <= 1) return 0;
        if (j - i == 2) return v[i] * v[i + 1] * v[j];
        if (dp[i][j] != -1) return dp[i][j];

        int score = Integer.MAX_VALUE;
        for (int k = i + 1; k < j; k++) {
            score = Math.min(score , minScore(v , i , k , dp) + v[i] * v[k] * v[j] + minScore(v , k , j , dp));
        }
        return dp[i][j] = score;
    }

    public int minScoreTriangulation(int[] values) {
        int n = values.length;
        int[][] dp = new int[n][n];

        for (int[] row : dp) {
            Arrays.fill(row, -1);
        }
        return minScore(values , 0 , n - 1 , dp);
    }
}