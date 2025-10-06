class Solution {
    public int[] decimalRepresentation(int n) {
        List<Integer> list = new ArrayList<>();
        int x = 1;
        int n1 = n;
        while (n1 > 0) {
            int num = n1 % 10;
            if (num != 0) {
                list.add(num * x);
            }
            n1 /= 10;
            x *= 10;
        }
        Collections.reverse(list);
        int l = list.size();
        int[] ans = new int[l];
        for (int i = 0; i < l; i++) {
            ans[i] = list.get(i);
        }
        return ans;
    }
}