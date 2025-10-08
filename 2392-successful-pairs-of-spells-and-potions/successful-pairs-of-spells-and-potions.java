class Solution {
    public static int f(int potions[],long val,long target){
        int n=potions.length;
        int low=0;
        int high=n-1;
        int idx=-1;
        while(low<=high){
            int mid=low+(high-low)/2;
            if((long)(potions[mid]*val)>=target){
                idx=mid;
                high=mid-1;
            }else{
                low=mid+1;
            }
        }
        return idx;
    }
    public int[] successfulPairs(int[] spells, int[] potions, long success) {
        int n=spells.length;
        int m=potions.length;
        int ans[]=new int[n];
        Arrays.sort(potions);
        for(int i=0;i<n;i++){
              int x=f(potions,spells[i],success);
            if(x!=-1){
              ans[i]=m-x;
            }
          
        }
        return ans;
    }
}
