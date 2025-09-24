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
        //  List<Integer> res = new ArrayList<>();

        // // Call the recursive function
        // // to populate the right-side view
        // recursionRight(root, 0, res);

        // return res;
         List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Map<Integer, Integer> map = new HashMap<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int level = 0;

        while (!q.isEmpty()) {
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();

                // overwrite so that last node at this level remains
                map.put(level, node.val);

                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            level++; // after finishing one level
        }

        for (int i = 0; i < map.size(); i++) {
            result.add(map.get(i));
        }
        return result;
    }
}