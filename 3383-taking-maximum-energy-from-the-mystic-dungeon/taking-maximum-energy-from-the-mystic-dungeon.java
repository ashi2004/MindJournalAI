class Solution {
    public int maximumEnergy(int[] energy, int k) {
        int n=energy.length;
        int dp[]=new int[n];
        Arrays.fill(dp,Integer.MIN_VALUE);
        for(int i=0;i<n;i++){
            dp[i]=energy[i];
        }
        dp[n-1]=energy[n-1];
        for(int i=n-2;i>=0;i--){
            if(i+k<n){
                dp[i]=dp[i+k]+energy[i];
            }
        }
        int ans=Integer.MIN_VALUE;
        
        for(int i=0;i<n;i++){
            ans=Math.max(ans,dp[i]);
        }
        return ans;
    }
}