class Solution {
    public int maxBottlesDrunk(int numBottles, int numExchange) {
        int full=numBottles;
        int empty=0;
        int ex=numExchange;
        int ans=0;
        while((full+empty)>=ex){
            if(empty<ex){
                ans=ans+full;
                empty+=full;
                full=0;
            }else{
                full++;
                empty=empty-ex;
                ex++;
            }
          
        }
         ans+=full; 
        return ans;
    }
}