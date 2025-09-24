/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    int maxi=Integer.MIN_VALUE;;
    public int maxsum(TreeNode root){
        if(root==null){
          return 0;
        }
        int left=Math.max(0,maxsum(root.left));
        int right=Math.max(0,maxsum(root.right));
        maxi=Math.max(maxi,left+right+root.val);
        return Math.max(left,right)+root.val;
    }
    public int maxPathSum(TreeNode root) {
        if(root==null){
            return 0;
        }
        // int maxi[]={Integer.MIN_VALUE};
        maxsum(root);
        return maxi;
    }
}