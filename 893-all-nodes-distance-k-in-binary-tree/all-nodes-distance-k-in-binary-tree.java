/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    // Step 1: Build parent map
    private void buildParent(TreeNode root, Map<TreeNode, TreeNode> parent) {
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node.left != null) {
                parent.put(node.left, node);
                q.add(node.left);
            }
            if (node.right != null) {
                parent.put(node.right, node);
                q.add(node.right);
            }
        }
    }

    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        buildParent(root, parent);  // preprocess parents

        List<Integer> result = new ArrayList<>();
        Set<TreeNode> visited = new HashSet<>();
        Queue<TreeNode> q = new LinkedList<>();
        
        q.add(target);
        visited.add(target);
        int dist = 0;

        // Step 2: BFS
        while (!q.isEmpty()) {
            int size = q.size();
            if (dist == k) {
                for (TreeNode node : q) {
                    result.add(node.val);
                }
                return result; // ✅ stop early
            }
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                // Explore neighbors
                if (node.left != null && !visited.contains(node.left)) {
                    q.add(node.left);
                    visited.add(node.left);
                }
                if (node.right != null && !visited.contains(node.right)) {
                    q.add(node.right);
                    visited.add(node.right);
                }
                if (parent.containsKey(node) && !visited.contains(parent.get(node))) {
                    q.add(parent.get(node));
                    visited.add(parent.get(node));
                }
            }
            dist++;
        }
        return result;
    }
}
