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
// class Solution {
//    public int f(TreeNode node,Map<TreeNode,Integer>map) {
//         if (node == null) return 0;

//         // If we take this node, we can take its grandchildren
//         int take = node.val;
//         if (node.left != null) {
//             take += f(node.left.left,map);
//             take += f(node.left.right,map);
//         }
//         if (node.right != null) {
//             take += f(node.right.left,map);
//             take += f(node.right.right,map);
//         }

//         // If we don't take this node, we move to its children
//         int notake = f(node.left,map) + f(node.right,map);

//         return Math.max(take, notake);
//     }
//     public int rob(TreeNode root) {
//         Map<TreeNode,Integer>map=new HashMap<>();
//         map.put(null, 0);
   
//     return f(root,map);
    
//      }
// }


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
public class Solution {
    private Map<TreeNode, Integer> cache;

    public int rob(TreeNode root) {
        cache = new HashMap<>();
        cache.put(null, 0);
        return dfs(root);
    }

    private int dfs(TreeNode root) {
        if (cache.containsKey(root)) {
            return cache.get(root);
        }

        int res = root.val;
        if (root.left != null) {
            res += dfs(root.left.left) + dfs(root.left.right);
        }
        if (root.right != null) {
            res += dfs(root.right.left) + dfs(root.right.right);
        }

        res = Math.max(res, dfs(root.left) + dfs(root.right));
        cache.put(root, res);
        return res;
    }
}