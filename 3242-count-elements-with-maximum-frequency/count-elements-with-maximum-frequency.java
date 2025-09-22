class Solution {
    public int maxFrequencyElements(int[] nums) {
        Map<Integer,Integer>map=new HashMap<>();
        int n=nums.length;
        for(int i=0;i<n;i++){
            map.put(nums[i],map.getOrDefault(nums[i],0)+1);
        }
        int max=0;
        for(int val:map.values()){
            max=Math.max(max,val);
        }
int cnt=0;
        for(int num:nums){
            if(map.get(num)==max){
                cnt++;
            }
        }
        return cnt;
    }
}