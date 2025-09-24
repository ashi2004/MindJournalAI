// /**
//  * Definition for a binary tree node.
//  * public class TreeNode {
//  *     int val;
//  *     TreeNode left;
//  *     TreeNode right;
//  *     TreeNode() {}
//  *     TreeNode(int val) { this.val = val; }
//  *     TreeNode(int val, TreeNode left, TreeNode right) {
//  *         this.val = val;
//  *         this.left = left;
//  *         this.right = right;
//  *     }
//  * }
//  */
class Solution {
   public int f(TreeNode node,Map<TreeNode,Integer>map) {
        if (node == null) return 0;
       if (map.containsKey(node)) return map.get(node);
        // If we take this node, we can take its grandchildren
        int take = node.val;
        if (node.left != null) {
            take += f(node.left.left,map);
            take += f(node.left.right,map);
        }
        if (node.right != null) {
            take += f(node.right.left,map);
            take += f(node.right.right,map);
        }

        // If we don't take this node, we move to its children
        int notake = f(node.left,map) + f(node.right,map);
          int ans = Math.max(take, notake);
        map.put(node, ans);

        return ans;
    }
    public int rob(TreeNode root) {
        Map<TreeNode,Integer>map=new HashMap<>();
        map.put(null, 0);
   
    return f(root,map);
    
     }
}


