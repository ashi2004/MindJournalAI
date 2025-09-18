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
    public void recursionRight(TreeNode root,int level,List<Integer>res){
        if(root==null){
            return;
        }
        if(res.size()==level){
            res.add(root.val);
        }
         recursionRight(root.right,level+1,res);
             recursionRight(root.left,level+1,res);
    }
    public List<Integer> rightSideView(TreeNode root) {
         List<Integer> res = new ArrayList<>();

        // Call the recursive function
        // to populate the right-side view
        recursionRight(root, 0, res);

        return res;
    }
}