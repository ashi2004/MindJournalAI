class Solution {
    public int maxArea(int[] height) {
        int n=height.length;
        int maxarea=Integer.MIN_VALUE;
          int i=0;
        int j=n-1;
        while(i<j){
            int area=Math.min(height[i],height[j])*(j-i);
            maxarea=Math.max(area,maxarea);
            if(height[i]<=height[j]){
                i++;
            }else{
                j--;
            }
        }

        
        return maxarea;
    }
}