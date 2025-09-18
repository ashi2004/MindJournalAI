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
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        // Map<x, Map<y, TreeSet of values>>
        Map<Integer, Map<Integer,ArrayList<Integer>>> map = new TreeMap<>();
        
        // Queue for BFS: node + x + y
        Queue<Tuple> q = new LinkedList<>();
        q.add(new Tuple(root, 0, 0));
        
        while (!q.isEmpty()) {
            Tuple t = q.poll();
            TreeNode node = t.node;
            int x = t.x, y = t.y;
            
            map.computeIfAbsent(x, k -> new TreeMap<>())
                .computeIfAbsent(y, k -> new ArrayList<>())
                .add(node.val);
            
            if (node.left != null) {
                q.add(new Tuple(node.left, x - 1, y + 1));
            }
            if (node.right != null) {
                q.add(new Tuple(node.right, x + 1, y + 1));
            }
        }
        
        List<List<Integer>> ans = new ArrayList<>();
        for (Map<Integer, ArrayList<Integer>> ys : map.values()) {
            List<Integer> col = new ArrayList<>();
            for (ArrayList<Integer> nodes : ys.values()) {
                Collections.sort(nodes);
                col.addAll(nodes);
            }
            ans.add(col);
        }
        return ans;
    }
}

// helper class for BFS
class Tuple {
    TreeNode node;
    int x, y;
    Tuple(TreeNode node, int x, int y) {
        this.node = node;
        this.x = x;
        this.y = y;
    }
}
