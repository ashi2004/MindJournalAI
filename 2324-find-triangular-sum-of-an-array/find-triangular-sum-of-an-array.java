class Solution {
    public int triangularSum(int[] nums) {
        int n=nums.length;
        int temp[]=nums;
        for(int t=n;t>1;t--){
            for(int i=0;i<n-1;i++){
              temp[i]=(temp[i+1]+temp[i])%10;
            }
        }
        return temp[0];
    }
}